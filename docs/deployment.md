# Triển khai Trello Cloud MVP với Supabase và Netlify

## 1. Chuẩn bị mã nguồn

- Làm việc trên nhánh `feat/trello-cloud-mvp` của repository `trello-web`.
- `trello-api` giữ nguyên; không cần chạy/deploy Express, MongoDB hay Render.
- Dùng Node.js 22+ và Yarn 1.22; chạy `yarn install --frozen-lockfile` trong `trello-web`.
- Bản này dùng tài khoản/dữ liệu mới. Không nhập mật khẩu hoặc collection MongoDB cũ vào `auth.users`.

## 2. Tạo Supabase project

1. Đăng nhập https://supabase.com/dashboard và tạo project mới.
2. Chọn tên, region phù hợp và mật khẩu database. Giữ mật khẩu riêng.
3. Chờ database sẵn sàng.
4. Mở SQL Editor, chạy từng file nguyên vẹn, đúng thứ tự:
   - `supabase/migrations/001_schema.sql`
   - `supabase/migrations/002_rls.sql`
   - `supabase/migrations/003_board_operations.sql`
5. Kiểm tra có ba bảng `boards`, `board_columns`, `cards` và RLS đã bật.

Các file là migration chạy một lần trên project mới, không chạy lại 001 trên database đã tạo bảng. Không cần bật Realtime hoặc tạo Storage bucket.

`user_id` liên kết tài khoản Supabase. Khóa ngoại xóa cascade. RLS kiểm tra quyền theo chủ board. RPC `mvp_board_operation` cập nhật mảng thứ tự cùng dữ liệu trong một transaction và khóa board trong thời gian thao tác.

## 3. Thiết lập đăng nhập

1. Trong Authentication, bật đăng nhập bằng Email/Password và cho phép đăng ký.
2. Với demo môn học: có thể tắt **Confirm email**. Sau đăng ký, Supabase tạo phiên và ứng dụng mở danh sách board.
3. Nếu bật Confirm email: cấu hình email/SMTP và giới hạn gửi phù hợp với project. Sau đăng ký, kiểm tra email, mở liên kết rồi đăng nhập. Cơ chế email mặc định có giới hạn; kiểm tra trước buổi demo.
4. Trong URL Configuration:
   - Site URL local: `http://localhost:5173`.
   - Redirect URL local: `http://localhost:5173/auth/callback`.
5. Sau khi có tên miền Netlify, đổi Site URL thành URL production và thêm `https://TEN-SITE.netlify.app/auth/callback` vào Redirect URLs. Có thể giữ URL local để phát triển.

## 4. Kết nối frontend local

1. Lấy Project URL và publishable key trong Connect/API Keys của project.
2. Sao chép `.env.example` thành `.env.local`:

```env
VITE_SUPABASE_URL=https://PROJECT-REF.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

Publishable key là khóa dùng trong trình duyệt. Không dùng secret key, `service_role`, mật khẩu database hoặc connection string trong biến `VITE_`.

3. Chạy `yarn dev`; mở URL do Vite in ra.
4. Nếu sửa biến môi trường, khởi động lại Vite.
5. Tạo tài khoản mới rồi tạo board, column, card. F5 để xác nhận dữ liệu đã lưu trên PostgreSQL.

Nếu chưa có biến môi trường, ứng dụng hiển thị hướng dẫn cấu hình, không tự gọi backend cũ và không tạo dữ liệu giả.

## 5. Kiểm tra trước khi deploy

```sh
yarn lint
yarn test:mvp
yarn build
yarn preview
```

Bài test SQL dùng PGlite để chạy PostgreSQL cục bộ, mô phỏng `auth.uid()` và các role Supabase. Nó kiểm tra migration, RLS giữa hai tài khoản, RPC, thứ tự và cascade. Chưa thay thế kiểm tra Supabase Auth và Data API thật.

## 6. Đưa nhánh MVP lên Git

Review `git diff` trước khi commit. Không commit `.env.local` hoặc khóa bí mật. Push nhánh `feat/trello-cloud-mvp` lên repository của bạn. Chưa cần merge vào `master`.

Lưu ý `trello-web` và `trello-api` hiện là hai repository riêng. Nếu Netlify import repository frontend, base directory để trống. Nếu bạn tự tổ chức thành monorepo có thư mục `trello-web`, đặt base directory là `trello-web`.

## 7. Tạo site Netlify

1. Đăng nhập https://app.netlify.com và chọn import project từ Git.
2. Chọn repository frontend và nhánh `feat/trello-cloud-mvp`.
3. Kiểm tra cấu hình:
   - Base directory: để trống nếu repo là frontend.
   - Build command: `yarn build`.
   - Publish directory: `dist`.
   - Node.js: 22, đã khai báo trong `netlify.toml` và `.nvmrc`.
4. Thêm hai environment variables ở bước 4, áp dụng cho build production.
5. Deploy và xem build log.
6. `netlify.toml` đã có rewrite `/* → /index.html` status 200 để React Router xử lý đường dẫn chi tiết.
7. Cập nhật Site URL / Redirect URLs trong Supabase theo bước 3.
8. Khi thay biến `VITE_` trên Netlify, deploy lại vì Vite đưa chúng vào bundle lúc build.

## 8. Kịch bản nghiệm thu

| Thao tác | Kết quả cần đạt |
|---|---|
| Đăng ký, đăng nhập, F5, đăng xuất | Phiên khôi phục đúng; đăng xuất về login |
| Board CRUD | Tạo, đọc, sửa tên/mô tả, xóa |
| Column CRUD | Tạo, sửa tên, xóa cả các card con |
| Card CRUD | Tạo, sửa tên/mô tả, xóa |
| Kéo column | Thứ tự vẫn đúng sau F5 |
| Kéo card cùng/khác column | Thứ tự và column vẫn đúng sau F5 |
| Kéo card cuối cùng ra khỏi column | Column rỗng vẫn có thể nhận card |
| Hủy kéo bằng Escape hoặc thả ngoài vùng | Dữ liệu trở lại trạng thái trước khi kéo |
| Đăng nhập bằng tài khoản B | Không thấy board của A; mở URL board A bị từ chối |
| Xóa board | Column/card liên quan bị xóa cascade |
| Mở trực tiếp `/boards/UUID` trên Netlify | Không gặp 404 từ hosting |
| Mất mạng khi lưu | Có thông báo lỗi; tải lại khi mạng trở lại |

## 9. Lỗi thường gặp

- **Missing environment variables:** kiểm tra tên biến và restart/redeploy.
- **Table/function not found:** chạy đủ 001 → 002 → 003 trên đúng project.
- **Email not confirmed:** xác nhận email hoặc tắt Confirm email cho demo.
- **Board not found/access denied:** sai ID, đã xóa, hoặc thuộc tài khoản khác.
- **Invalid order:** dữ liệu thay đổi trong tab khác; tải lại board rồi kéo lại.
- **Refresh URL 404:** kiểm tra Netlify nhận đúng `netlify.toml` và publish directory.

## Tài liệu chính thức

- React: https://supabase.com/docs/guides/getting-started/quickstarts/reactjs
- RLS: https://supabase.com/docs/guides/database/postgres/row-level-security
- Database functions: https://supabase.com/docs/guides/database/functions
- Auth redirects: https://supabase.com/docs/guides/auth/redirect-urls
- Netlify Vite: https://docs.netlify.com/build/frameworks/framework-setup-guides/vite/

## Kiểm tra trình duyệt tự động (tùy chọn)

Dùng tài khoản demo riêng trên Supabase và Chrome cài sẵn. Không dùng tài khoản có dữ liệu quan trọng. Bài test tạo và xóa board có tên bắt đầu bằng MVP test; nếu test bị ngắt, có thể cần xóa board test còn lại bằng giao diện.

PowerShell:

```powershell
$env:TEST_APP_URL = 'http://localhost:5173'
$env:TEST_EMAIL = 'YOUR_TEST_EMAIL'
$env:TEST_PASSWORD = 'YOUR_TEST_PASSWORD'
yarn test:e2e
```

Không có TEST_EMAIL/TEST_PASSWORD, các bài test trình duyệt được đánh dấu skipped. Selenium Manager cần truy cập mạng trong lần đầu để tìm ChromeDriver phù hợp. Không lưu tài khoản thật trong mã nguồn.
