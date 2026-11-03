import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { Grid, Card as MuiCard, Paper } from '@mui/material'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import GroupIcon from '@mui/icons-material/Group'
import CommentIcon from '@mui/icons-material/Comment'
import AttachmentIcon from '@mui/icons-material/Attachment'
import { useDispatch } from 'react-redux'
import { updateCurrentAcitveCard, showModalActiveCard } from '~/redux/acitveCard/activeCardSlice'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

function Card( { card } ) {
  const dispatch = useDispatch()
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card._id,
    data: { ...card }
  })

  const dndKitCardStyles = {
    // touchAction: 'none',
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
    border: isDragging ? '1px solid #2ecc71' : undefined
  }

  const shouldShowCardAction = () => {
    return !!card?.memberIds?.length || !!card?.comments?.length || !!card?.attachments?.length || !!card?.labels?.length
  }

  const setActiveCard = () => {
    // Set cái active card hiện lên vào trong redux
    dispatch(updateCurrentAcitveCard(card))
    // Hiện cái Active Card lên
    dispatch(showModalActiveCard())
  }

  return (
    <MuiCard
      onClick={setActiveCard}
      ref={setNodeRef} style={dndKitCardStyles} {...attributes} {...listeners}
      sx={{
        borderRadius: '8px',
        cursor: 'pointer',
        boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
        overflow: 'unset',
        display: card?.FE_PlaceholderCard ? 'none' : 'block',
        border: '2px solid transparent',
        '&:hover': { borderColor: (theme) => theme.palette.primary.main }
      }}>
      {card?.cover && <CardMedia sx={{ height: 140, borderRadius: '8px 8px 0 0' }} image= {card.cover} component="img" />
      }
      <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
        <Typography>{card?.title}</Typography>
      </CardContent>
      {shouldShowCardAction() &&
      <>
        {!!card?.labels?.length &&
        <CardContent sx={{ pt: 0, pl: 1.5 }}>
          <Grid container spacing={{ xs: 0.5, md: 0.5 }}>
            {card?.labels?.map((label, index) => (
              <Grid item key={index} >
                <Paper
                  sx={{
                    position: 'relative',
                    height: 15,
                    width: 40,
                    borderRadius: 1,
                    cursor: 'pointer',
                    transition: '0.2s',
                    background: label.labelValue
                  }}
                />
              </Grid>
            ))
            }
          </Grid>
        </CardContent>
        }

        <CardActions sx={{ p: '0 4px 8px 4px' }}>
          {!!card?.memberIds?.length &&
            <Button startIcon={<GroupIcon />} size="small">{card?.memberIds?.length}</Button>
          }
          {!!card?.comments?.length &&
            <Button startIcon={<CommentIcon />} size="small">{(card?.comments)?.length}</Button>
          }
          {!!card?.attachments?.length &&
            <Button startIcon={<AttachmentIcon />} size="small">{(card?.attachments)?.length}</Button>
          }
        </CardActions>
      </>
      }
    </MuiCard>
  )
}

export default Card
