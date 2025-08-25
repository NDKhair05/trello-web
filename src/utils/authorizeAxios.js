import axios from 'axios'
import { toast } from 'react-toastify'
import { interceptorLoadingElements } from '~/utils/formatters'

//Khởi tạo một đối tượng Axios (authorizedAxiosInstance) mục đích để custom và cấu hình chung cho dự án.
let authorizedAxiosInstance = axios.create()

// Thời gian chờ tối đa của 1 request: để 10 phút
authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 10

// withCredentials: Sẽ cho phép axios tự động gửi cookie trong mỗi request lên BE (phục vụ việc chúng ta sẽ lưu JWT tokens
// (refresh & access) vào trong httpOnly Cookie của trình duyệt)
authorizedAxiosInstance.defaults.withCredentials = true

//Cấu hình Interceptor (bộ đánh chặn giữa req và res)
// Add a request interceptor
authorizedAxiosInstance.interceptors.request.use((config) => {
  // Do something before request is sent
// Chặn spam nút có chức năng call API
  interceptorLoadingElements(true)

  return config
}, (error) => {
  // Do something with request error
  return Promise.reject(error)
}
)

// Add a response interceptor
authorizedAxiosInstance.interceptors.response.use((response) => {
// Chặn spam nút có chức năng call API
  interceptorLoadingElements(false)

  return response
}, (error) => {
  // Chặn spam nút có chức năng call API
  interceptorLoadingElements(false)
  // Xử lí tập trung phần hiển thị thông báo lỗi trả về từ mọi API ở đây (clean code 1 lần thay vì phải try catch ở từng hàm gọi API)
  let errorMessage = error?.message
  if (error?.response?.data?.message) {
    errorMessage = error?.response?.data?.message
  }

  //Hiển thị mọi mã lỗi trên màn hình trừ 410 - GONE phục vụ việc tự động refresh lại token
  if (error.respone?.status !== 410) {
    toast.error(errorMessage)
  }

  return Promise.reject(error)
})

export default authorizedAxiosInstance
