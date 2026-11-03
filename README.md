# Trello Cloud — MVP

Ứng dụng quản lý công việc cá nhân, tái sử dụng giao diện Trello Clone.

- React + Vite + MUI + Redux + Dnd Kit.
- Supabase Auth và PostgreSQL; RLS tách dữ liệu theo tài khoản.
- Board / Column / Card CRUD; lưu thứ tự kéo thả.
- Netlify hosting, không cần chạy Express hoặc MongoDB.

## Chạy local

1. Dùng Node.js 22 trở lên và Yarn 1.22.
2. `yarn install --frozen-lockfile`.
3. Tạo Supabase project và chạy ba file trong `supabase/migrations` theo thứ tự 001 → 002 → 003.
4. Sao chép `.env.example` thành `.env.local`, điền project URL và publishable key.
5. `yarn dev`.

Xem **[hướng dẫn Supabase và Netlify từng bước](docs/deployment.md)**.

## Kiểm tra

```sh
yarn lint
yarn test:mvp
yarn build
```

`test:mvp` chạy SQL migration/RLS/RPC trên PostgreSQL cục bộ bằng PGlite và kiểm tra mapping dữ liệu. Không cần tài khoản cloud. Kiểm tra Auth và email trên Supabase thật theo tài liệu triển khai.

## Phạm vi

Giữ: đăng ký, đăng nhập, đăng xuất, quản lý board/column/card, kéo thả.
Tạm bỏ: thành viên, lời mời, thông báo, Socket.IO, realtime, upload, tài khoản nâng cao, nhãn và bình luận.

Backend `trello-api` nằm ngoài repository frontend, được giữ nguyên để tham khảo phiên bản MongoDB. Bản MVP không gọi backend đó. Dữ liệu MongoDB và tài khoản cũ chưa được chuyển sang Supabase.

## Nguồn gốc

Giao diện kế thừa dự án Trello Clone dựa trên hướng dẫn TrungQuanDev (https://youtube.com/@trungquandev), được điều chỉnh cho đồ án Điện toán đám mây. Giữ thông tin tác giả gốc trong package và mã nguồn liên quan.

## Chuyển giữa bản gốc và MVP

Sau khi các thay đổi đã commit, chạy trong thư mục `trello-web`:

```sh
git switch master
# Quay lại MVP:
git switch feat/trello-cloud-mvp
```

Hai nhánh dùng cùng thư mục node_modules; sau khi chuyển nhánh, chạy lại `yarn install --frozen-lockfile` để dùng đúng dependency. Backend cũ chỉ cần chạy khi sử dụng nhánh gốc.
