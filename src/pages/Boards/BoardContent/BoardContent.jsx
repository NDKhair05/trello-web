import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'

import {
  DndContext,
  // PointerSensor,
  // MouseSensor,
  // TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  closestCorners,
  pointerWithin,
  getFirstCollision
} from '@dnd-kit/core'
import { MouseSensor, TouchSensor } from '~/customLibraries/DndKitSensors'

import { arrayMove } from '@dnd-kit/sortable'
import { useEffect, useState, useCallback, useRef } from 'react'
import { cloneDeep, isEmpty } from 'lodash'
import { generatePlaceholderCard } from '~/utils/formatters'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}


function BoardContent({
  board,
  moveColumn,
  moveCardInTheSameColumn,
  moveCardToDifferentColumn
}) {
  // const pointerSensor = useSensor(PointerSensor, { activationConstraint: { distance: 10 } })

  //Yêu cầu chuột di chuyển 10px mới kích hoạt event, tránh trường hợp click vẫn kích hoạt event
  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } })

  //Nhấn giữ 250ms và dung sai của cảm ứng 500px thì mới kích hoạt event
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 500 } })

  //Ưu tiên sử dụng kết hợp 2 loại sensors là mouse và touch để có trải nghiệm trên mobile tốt nhất, không bị bug
  // const sensors = useSensors(pointerSensor)
  const sensors = useSensors(mouseSensor, touchSensor)

  const [orderedColumns, setOrderedColumns] = useState([])
  //Cùng một thời điểm chỉ có một phần tử được kéo Column hoặc Cảd
  const [activeDragItemId, setActiveDragItemId] = useState(null)
  const [activeDragItemType, setActiveDragItemType] = useState(null)
  const [activeDragItemData, setActiveDragItemData] = useState(null)
  const [oldColumnWhenDragginCard, setOldColumnWhenDraggingCard] = useState(null)

  const lastOverId = useRef(null)
  const dragSnapshot = useRef([])

  useEffect(() => {
    setOrderedColumns(board.columns)
  }, [board])

  const findColumnByCardId = (cardId) => {
    return orderedColumns.find(column => column._id === cardId || column.cards.some(card => card._id === cardId))
  }

  const moveCardBetweenDifferentColumns = (
    overColumn,
    overCardId,
    active,
    over,
    activeColumn,
    activeDraggingCardId,
    activeDraggingCardData,
    triggerFrom
  ) => {
    {
      const overCardIndex = overColumn?.cards.findIndex(card => card._id === overCardId)

      let newCardIndex
      const isBelowOverItem = active.rect.current.translated &&
                active.rect.current.translated.top > over.rect.top + over.rect.height
      const modifier = isBelowOverItem ? 1 : 0
      newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.length + 1

      const nextColumns = cloneDeep(orderedColumns)
      const nextActiveColumn = nextColumns.find(column => column._id === activeColumn._id)
      const nextOverColumn = nextColumns.find(column => column._id === overColumn._id)

      if (nextActiveColumn) {
        nextActiveColumn.cards = nextActiveColumn.cards.filter(card => card._id !== activeDraggingCardId)
        if (isEmpty(nextActiveColumn.cards)) {
          nextActiveColumn.cards = [generatePlaceholderCard(nextActiveColumn)]
        }

        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(card => card._id)
      }
      if (nextOverColumn) {
        nextOverColumn.cards = nextOverColumn.cards.filter(card => card._id !== activeDraggingCardId)

        const rebuild_activeDraggingCardData = {
          ...activeDraggingCardData,
          columnId: nextOverColumn._id
        }

        nextOverColumn.cards = [...nextOverColumn.cards.slice(0, newCardIndex), rebuild_activeDraggingCardData, ...nextOverColumn.cards.slice(newCardIndex)]

        nextOverColumn.cards = nextOverColumn.cards.filter(card => !card.FE_PlaceholderCard)

        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card._id)
      }

      setOrderedColumns(nextColumns)

      //Nếu function này được gọi từ handleDragEnd nghĩa là đã kéo xong, lúc này mới xử lý gọi API 1 lần ở đây
      if (triggerFrom === 'handleDragEnd') {
        moveCardToDifferentColumn(
          activeDraggingCardId,
          oldColumnWhenDragginCard._id,
          nextOverColumn._id,
          nextColumns)
      }

    }
  }

  const handleDragStart = (event) => {
    dragSnapshot.current = cloneDeep(orderedColumns)
    lastOverId.current = null
    // console.log('handleDragStart : ', event)
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(event?.active?.data?.current)

    if (event?.active?.data?.current?.columnId) {
      setOldColumnWhenDraggingCard(findColumnByCardId(event?.active?.id))
    }
  }

  const handleDragOver = (event) => {
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return

    // console.log('handleDragOver : ', event)
    const { active, over } = event
    if (!active || !over) return

    const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
    const { id: overCardId } = over

    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)
    // console.log('activeColumn : ', activeColumn)
    // console.log('overColumn : ', overColumn)

    if (!activeColumn || !overColumn) return

    if (activeColumn._id !== overColumn._id) {
      moveCardBetweenDifferentColumns(
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDraggingCardId,
        activeDraggingCardData,
        'handleDragOver'
      )
    }

  }

  const resetDrag = () => {
    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
    setOldColumnWhenDraggingCard(null)
    lastOverId.current = null
  }
  const cancelDrag = () => {
    setOrderedColumns(dragSnapshot.current)
    resetDrag()
  }

  const handleDragEnd = (event) => {
    // console.log('handleDragEnd : ', event)
    const { active, over } = event
    //Kiểm tra sự tồn tại của over (kéo linh tinh ra ngoài thì return luôn tránh lỗi)
    if (!active || !over) { cancelDrag(); return }

    //Xử lí kéo thả Cards
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
      const { id: overCardId } = over

      const activeColumn = findColumnByCardId(activeDraggingCardId)
      const overColumn = findColumnByCardId(overCardId)

      if (!activeColumn || !overColumn || !oldColumnWhenDragginCard) { cancelDrag(); return }

      //Kéo thả card ở 2 column khác nhau
      if (oldColumnWhenDragginCard._id !== overColumn._id) {
        moveCardBetweenDifferentColumns(
          overColumn,
          overCardId,
          active,
          over,
          activeColumn,
          activeDraggingCardId,
          activeDraggingCardData,
          'handleDragEnd'
        )
      } else {
        //Kéo thả card trong cùng một column
        //Xử lí kéo card trong một oldColumnWhenDragginCard
        const oldCardIndex = oldColumnWhenDragginCard?.cards?.findIndex(c => c._id === activeDragItemId)
        // Lấy vị trí cũ của card (từ over)
        const targetIndex = overColumn?.cards?.findIndex(c => c._id === overCardId)
        const newCardIndex = targetIndex < 0 ? overColumn.cards.length - 1 : targetIndex

        const dndOrderedCards = arrayMove(oldColumnWhenDragginCard?.cards, oldCardIndex, newCardIndex)
        const dndOrderedCardsIds = dndOrderedCards.map(card => card._id)

        setOrderedColumns(prevColumns => {
          const nextColumns = cloneDeep(prevColumns)
          //Tìm column chuẩn bị thả card vào
          const targetColumn = nextColumns.find(column => column._id === overColumn._id)

          targetColumn.cards = dndOrderedCards
          targetColumn.cardOrderIds = dndOrderedCardsIds

          return nextColumns
        })

        moveCardInTheSameColumn(dndOrderedCards, dndOrderedCardsIds, oldColumnWhenDragginCard._id)
      }
    }

    //Xử lí kéo thả Columns trong một Board
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {

      if (active.id !== over.id) {
        // Lấy vị trí cũ của cột (từ active)
        const oldColumnIndex = orderedColumns.findIndex(c => c._id === active.id)
        // Lấy vị trí cũ của cột (từ over)
        const newColumnIndex = orderedColumns.findIndex(c => c._id === over.id)
        if (oldColumnIndex < 0 || newColumnIndex < 0) { cancelDrag(); return }

        const dndOrderedColumns = arrayMove(orderedColumns, oldColumnIndex, newColumnIndex)
        //2 cái console.log dữ liệu này sau dùng để xử lí gọi API
        // const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
        // console.log('dndOrderedColumns : ', dndOrderedColumns)
        // console.log('dndOrderedColumnsIds : ', dndOrderedColumnsIds)

        //Cập nhật lại state  ban đầu sau khi đã kéo thả column
        setOrderedColumns(dndOrderedColumns)

        moveColumn(dndOrderedColumns)
      }
    }

    resetDrag()
  }

  const customDropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({ styles :  { active : { opacity: '0.5' } } })
  }

  const collisionDetectionStrategy = useCallback((args) => {
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      return closestCorners({ ...args, droppableContainers: args.droppableContainers.filter(container => orderedColumns.some(column => column._id === container.id)) })
    }

    const pointerIntersections = pointerWithin(args)

    //fix trường hợp flicker khi kéo thả card
    if (!pointerIntersections?.length) return []

    // const interSections = !!pointerIntersections?.length
    //   ? pointerIntersections
    //   : rectIntersection(args)

    let overId = getFirstCollision(pointerIntersections, 'id')
    if (overId) {

      const checkColumn = orderedColumns.find(column => column._id === overId)
      if (checkColumn) {
        overId = closestCorners({
          ...args,
          droppableContainers: args.droppableContainers.filter(container =>
          { return (container.id !== overId) && (checkColumn?.cardOrderIds?.includes(container.id))
          })
        })[0]?.id || checkColumn._id
      }

      lastOverId.current = overId
      return [{ id: overId }]
    }

    return lastOverId.current ? [{ id: lastOverId.current }] : []
  }, [activeDragItemType, orderedColumns])

  return (
    <DndContext
      sensors={sensors}
      // collisionDetection={closestCorners}
      collisionDetection={collisionDetectionStrategy}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={cancelDrag}
    >
      <Box sx={{
        // bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
        bgcolor: (theme) => (board?.theme?.type === 'default' ? (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2') : ''),
        backgroundImage: board?.theme?.type === 'gradient' ? board?.theme?.value : '',
        width: '100%',
        height: (theme) => theme.trello.boardContentHeight,
        p: '10px 0'
      }}>
        <ListColumns
          columns = {orderedColumns}
        />
        <DragOverlay dropAnimation={customDropAnimation}>
          {!activeDragItemType && null}
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) && <Box sx={{ width: 300, p: 2, borderRadius: 2, bgcolor: 'background.paper', boxShadow: 4 }}>{activeDragItemData?.title}</Box>}
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) && <Box sx={{ width: 280, p: 2, borderRadius: 2, bgcolor: 'background.paper', boxShadow: 4 }}>{activeDragItemData?.title}</Box>}
        </DragOverlay>
      </Box>
    </DndContext>
  )
}

export default BoardContent
