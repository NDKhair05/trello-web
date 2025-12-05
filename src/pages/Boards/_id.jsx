//Board Details
import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import ActiveCard from '~/components/Modal/ActiveCard/ActiveCard'

import {
  updateBoardDetailsAPI,
  updateColumnDetailsAPI,
  moveCardToDifferentColumnAPI
} from '~/apis'
import { cloneDeep } from 'lodash'
// import { mockData } from '~/apis/mock-data'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchBoardDetailsAPI,
  updateCurrentActiveBoard,
  selectCurrentActiveBoard
} from '~/redux/activeBoard/activeBoardSlice'
import { socketIoInstance } from '~/sockeClient'
import { selectCurrentUser } from '~/redux/user/userSlice'

function Board() {
  const dispatch = useDispatch()
  // const [board, setBoard] = useState(null)
  const board = useSelector(selectCurrentActiveBoard)
  const currentUser = useSelector(selectCurrentUser)

  const { boardId } = useParams()

  useEffect(() => {
    // const boardId = '6896e71dbc96537aa7507104'
    //Call API
    dispatch(fetchBoardDetailsAPI(boardId))

    const newMemberToBoard = (payload) => {
      if (payload.inviterId === currentUser._id) {
        dispatch(fetchBoardDetailsAPI(boardId))
      }
    }

    const updatedActiveBoard = (board) => {
      if (board._id === boardId) {
        dispatch(fetchBoardDetailsAPI(board._id))
      }
    }

    socketIoInstance.on('BE_UPDATE_ACTIVE_BOARD', updatedActiveBoard)
    socketIoInstance.on('BE_USER_RESPONDED_NOTIFICATION', newMemberToBoard)

    return () => {
      socketIoInstance.off('BE_UPDATE_ACTIVE_BOARD', updatedActiveBoard)
      socketIoInstance.off('BE_USER_RESPONDED_NOTIFICATION', newMemberToBoard)
    }

  }, [dispatch, boardId, currentUser._id])

  //Func này có nhiệm vụ là gọi API và xử lí khi kéo thả Column xong xuôi
  const moveColumn = (dndOrderedColumns) => {
    //Update cho chuẩn dữ liệu State Board
    const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    //Gọi API update board
    updateBoardDetailsAPI(newBoard._id, { columnOrderIds: dndOrderedColumnsIds })
      .then(() => {
        dispatch(updateCurrentActiveBoard(newBoard))
      })
  }

  const moveCardInTheSameColumn = (dndOrderedCards, dndOrderedCardsIds, columnId) => {
    //Update cho chuẩn dữ liệu State Board
    const newBoard = cloneDeep(board)
    const columnToUpdate = newBoard.columns.find(column => column._id === columnId)
    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards
      columnToUpdate.cardOrderIds = dndOrderedCardsIds
    }
    //Gọi API update Column
    updateColumnDetailsAPI(columnId, { cardOrderIds: dndOrderedCardsIds })
      .then(() => {
        dispatch(updateCurrentActiveBoard(newBoard))
      })
  }

  /**
   * Khi di chuyển card sang column khác:
   * B1: Cập nhật lại mảng cardOrderIds của Column ban đầu chứa nó (Hiểu bản chất là xóa cái _id của Card ra khỏi mảng)
   * B2: Cập nhật mảng cardOrderIds của Column tiếp theo (Hiểu bản chất là thêm _id của Card vào mảng)
   * B3: Cập nhật lại trường columnId mới của cái Card đã kéo
   * => Làm một API support riêng
   */
  const moveCardToDifferentColumn = (currentCardId, prevColumnId, nextColumnId, dndOrderedColumns) => {
    //Update cho chuẩn dữ liệu state Board
    const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds

    let prevCardOrderIds = dndOrderedColumns.find(c => c._id === prevColumnId)?.cardOrderIds
    //Xử lí kéo thả Card ra khỏi Column, Column rỗng sẽ có placeholder-card, cần xóa nó đi sau khi kéo Card cuối cùng ra khỏi Column đó
    if (prevCardOrderIds[0].includes('placeholder-card')) prevCardOrderIds = []

    //Call API xử lý phía Back-end
    moveCardToDifferentColumnAPI({
      currentCardId,
      prevColumnId,
      prevCardOrderIds,
      nextColumnId,
      nextCardOrderIds: dndOrderedColumns.find(c => c._id === nextColumnId)?.cardOrderIds
    })
      .then(() => {
        dispatch(updateCurrentActiveBoard(newBoard))
      })

  }

  if (!board) {
    return (
      <PageLoadingSpinner caption = "Loading Board...." />
    )
  }

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      {/*Modal Active Card, check đóng/mở dựa theo cái State được lưu trong Redux*/}
      <ActiveCard />
      {/** Các thành phần còn lại của Board Details */}
      <AppBar />
      <BoardBar board = {board}/>
      <BoardContent
        board = {board}

        moveColumn = {moveColumn}
        moveCardInTheSameColumn = {moveCardInTheSameColumn}
        moveCardToDifferentColumn = {moveCardToDifferentColumn}
      />
    </Container>
  )
}

export default Board
