import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { Card as MuiCard } from '@mui/material'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import GroupIcon from '@mui/icons-material/Group'
import CommentIcon from '@mui/icons-material/Comment'
import AttachmentIcon from '@mui/icons-material/Attachment'

function Card( { mustangCard, temporaryHideMediaCard } ) {
  if (mustangCard) {
    return (
      <MuiCard sx={{
        cursor: 'pointer',
        boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
        overflow: 'unset'
      }}>
        <CardMedia
          sx={{ height: 140 }}
          image="https://i.pinimg.com/736x/b2/8e/cf/b28ecfa82b814c73c8f481767725a9cf.jpg"
          title="green iguana"
        />
        <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
          <Typography>Mustang® EcoBoost® Fastback</Typography>
        </CardContent>
        <CardActions sx={{ p: '0 4px 8px 4px' }}>
          <Button startIcon={<GroupIcon />} size="small">20</Button>
          <Button startIcon={<CommentIcon />} size="small">15</Button>
          <Button startIcon={<AttachmentIcon />} size="small">10</Button>
        </CardActions>
      </MuiCard>
    )
  }
  if (temporaryHideMediaCard) {
    return (
      <MuiCard sx={{
        cursor: 'pointer',
        boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
        overflow: 'unset'
      }}>
        <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
          <Typography>Card 01</Typography>
        </CardContent>
      </MuiCard>
    )
  }
  return (
    <MuiCard sx={{
      cursor: 'pointer',
      boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
      overflow: 'unset'
    }}>
      <CardMedia
        sx={{ height: 140 }}
        image="https://i.pinimg.com/736x/7f/02/f7/7f02f7f6985458a48ddb7ebb3dff550c.jpg"
        title="green iguana"
      />
      <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
        <Typography>2024 Porsche 911 GT3 RS (992 I)</Typography>
      </CardContent>
      <CardActions sx={{ p: '0 4px 8px 4px' }}>
        <Button startIcon={<GroupIcon />} size="small">20</Button>
        <Button startIcon={<CommentIcon />} size="small">15</Button>
        <Button startIcon={<AttachmentIcon />} size="small">10</Button>
      </CardActions>
    </MuiCard>
  )
}

export default Card
