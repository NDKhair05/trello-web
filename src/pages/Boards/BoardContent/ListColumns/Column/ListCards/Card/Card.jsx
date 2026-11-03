import { Card as MuiCard, CardContent, Typography } from '@mui/material'
import { useDispatch } from 'react-redux'
import { updateCurrentAcitveCard, showModalActiveCard } from '~/redux/acitveCard/activeCardSlice'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

function Card({ card }) {
  const dispatch = useDispatch()
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: card._id, data: { ...card } })
  return <MuiCard ref={setNodeRef} {...attributes} {...listeners}
    style={{ transform: CSS.Translate.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}
    onClick={() => { if (!card.FE_PlaceholderCard) { dispatch(updateCurrentAcitveCard(card)); dispatch(showModalActiveCard()) } }}
    sx={{ display: card.FE_PlaceholderCard ? 'none' : 'block', borderRadius: 2, cursor: 'pointer', border: '2px solid transparent', '&:hover': { borderColor: 'primary.main' } }}>
    <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}><Typography sx={{ overflowWrap: 'anywhere' }}>{card.title}</Typography></CardContent>
  </MuiCard>
}
export default Card
