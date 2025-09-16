import axios from 'axios'
import { toast } from 'react-toastify'
import { interceptorLoadingElements } from '~/utils/formatters'
import { refreshTokenAPI } from '~/apis'
import { logoutUserAPI } from '~/redux/user/userSlice'

let axiosReduxStore
export const injectStore = mainStore => { axiosReduxStore = mainStore }

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

//Khởi tạo một cái promise cho việc gọi api refresh_token
//Mục đích của Promise này là để khi gọi api refresh_token xong xuôi thì mới retry lại nhiều api bị lỗi trước đó
let refreshTokenPromise = null

// Add a response interceptor: Can thiệp vào những cái response nhận về
authorizedAxiosInstance.interceptors.response.use((response) => {
// Chặn spam nút có chức năng call API
  interceptorLoadingElements(false)

  return response
}, (error) => {
  // Chặn spam nút có chức năng call API
  interceptorLoadingElements(false)

  /**Quan trọng: Xử lí refresh token tự động */
  //Trường hợp 1: nếu nhận mã 401 từ BE, gọi api log out ngay lập tức.
  if (error.response?.status === 401) {
    axiosReduxStore.dispatch(logoutUserAPI(false))
  }

  //Trường hợp 2: Nếu như nhận mã 410 từ BE, thì sẽ gọi api refreshToken để làm mới lại accessToken
  //Đầu tiên lấy được các request API đang bị lỗi thông qua error.config
  const originalRequest = error.config
  if (error.response?.status === 410 && !originalRequest._retry) {

    originalRequest._retry = true

    //Kiểm tra xem nếu chưa có refreshTokenPromise thì thực hiện
    if (!refreshTokenPromise) {
      refreshTokenPromise = refreshTokenAPI()
        .then(data => {
          //Đồng thời accessToken đã nằm trong httpOnlyCookie
          return data?.accessToken
        })
        .catch((_error) => {
          //Nếu nhận bất kì lỗi nào từ api refreshToken thì logout luôn
          axiosReduxStore.dispatch(logoutUserAPI(false))
          return Promise.reject(_error)
        })
        .finally(() => {
          //Dù APi có ok hay không thì vẫn luôn gán lại refreshTokenPromise là null như ban đầu
          refreshTokenPromise = null
        })
    }

    // eslint-disable-next-line no-unused-vars
    return refreshTokenPromise.then(accessToken => {
      /**
       * Bước 1: Đối với TH nếu dự án cần lưu accessToken vào localStorage hoặc đâu đó thì sẽ viết thêm code xử lý ở đây
       * Hiện tại ở đây không cần B1 này vì ta đã đưa accessToken vào cookie (xử lý từ phía BE) sau khi api refreshToken được gọi thành công
       */

      //Bước 2: Bước quan trọng: Return lại axios instance của chúng ta kết hợp với các originalRequests để gọi lại những api ban đầu bị lỗi
      return authorizedAxiosInstance(originalRequest)
    })
  }


  // Xử lí tập trung phần hiển thị thông báo lỗi trả về từ mọi API ở đây (clean code 1 lần thay vì phải try catch ở từng hàm gọi API)
  let errorMessage = error?.message
  if (error?.response?.data?.message) {
    errorMessage = error?.response?.data?.message
  }

  //Hiển thị mọi mã lỗi trên màn hình trừ 410 - GONE phục vụ việc tự động refresh lại token
  if (error.response?.status !== 410) {
    toast.error(errorMessage)
  }

  return Promise.reject(error)
})

export default authorizedAxiosInstance
