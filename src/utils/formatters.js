

export const capitalizeFirstLetter = (val) => {
  if (!val) return ''
  return `${val.charAt(0).toUpperCase()}${val.slice(1)}`
}

export const generatePlaceholderCard = (column) => {
  return {
    _id: `${column._id}-placeholder-card`,
    boardId: column.boardId,
    columnId: column._id,
    FE_PlaceholderCard: true
  }
}

// Kỹ thuật dùng css pointer-event để chặn user spam click tại bất kỳ chỗ nào có hành động click gọi api
// Đây là một kỹ thuật rất hay tận dụng Axios Interceptors và CSS Pointer-events để chỉ phải viết code xử lý một lần cho toàn bộ dự án
// Cách sử dụng: Với tất cả các link hoặc button mà có hành động gọi api thì thêm class "interceptor-loading" cho nó là xong.
export const interceptorLoadingElements = (calling) => {
  // DOM lấy ra toàn bộ phần tử trên page hiện tại có className là 'interceptor-loading'
  const elements = document.querySelectorAll('.interceptor-loading')
  for (let i = 0; i < elements.length; i++) {
    if (calling) {
      // Nếu đang trong thời gian chờ gọi API (calling === true) thì sẽ làm mờ phần tử và chặn click bằng css pointer-events
      elements[i].style.opacity = '0.5'
      elements[i].style.pointerEvents = 'none'
    } else {
      // Ngược lại thì trả về như ban đầu, không làm gì cả
      elements[i].style.opacity = 'initial'
      elements[i].style.pointerEvents = 'initial'
    }
  }
}

export const gradientThemes = [
  {
    id: 0,
    type: 'default',
    value: 'default'
  },
  {
    id: 1,
    type: 'gradient',
    value: 'linear-gradient(120deg, #a6c0fe 0%, #f68084 100%);'
  },
  {
    id: 2,
    type: 'gradient',
    value: 'linear-gradient(to right, #fa709a 0%, #fee140 100%);'
  },
  {
    id: 3,
    type: 'gradient',
    value: 'linear-gradient(to right, #74ebd5 0%, #9face6 100%);'
  },
  {
    id: 4,
    type: 'gradient',
    value: 'linear-gradient(90deg, #3F2B96 0%, #A8C0FF 100%)'
  },
  {
    id: 5,
    type: 'gradient',
    value: 'linear-gradient(90deg, #FC466B 0%, #3F5EFB 100%)'
  },
  {
    id: 6,
    type: 'gradient',
    value: 'linear-gradient(to right, #3ab5b0 0%, #3d99be 31%, #56317a 100%);'
  }
]

export const labelColorsDefault = [
  {
    id: 0,
    value: '#4bce97'
  },
  {
    id: 1,
    value: '#eed12b'
  },
  {
    id: 2,
    value: '#fca700'
  },
  {
    id: 3,
    value: '#f87168'
  },
  {
    id: 4,
    value: '#c97cf4'
  },
  {
    id: 5,
    value: '#669df1'
  },
  {
    id: 6,
    value: '#6cc3e0'
  },
  {
    id: 7,
    value: '#94c748'
  }
]

