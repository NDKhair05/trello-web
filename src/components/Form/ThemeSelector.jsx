import { Box, Grid, Typography, Paper, Divider, Chip } from '@mui/material'
import { gradientThemes } from '~/utils/formatters'

export default function ThemeSelector({ value, onChange }) {
  // loại bỏ theme default
  const themeSelection = gradientThemes.slice(1)
  return (
    <Box sx={{ mb: 1.5 }} >
      <Typography variant="subtitle1" sx={{ mb: 3 }}>
        <Divider><Chip label= 'Select theme' size='medium' /></Divider>
      </Typography>

      <Grid container spacing={{ xs: 2, md: 2.5 }} columns={{ xs: 4, sm: 8, md: 12 }} sx={{ justifyContent: 'center', alignItems: 'center' }}>
        {themeSelection.map(theme => (
          <Grid item key={theme.id} size={{ xs: 2, sm: 4, md: 4 }}>
            <Paper
              onClick={() => value.id === theme.id ? onChange({}) : onChange(theme) }
              elevation={value?.id === theme.id ? 6 : 0}
              sx={{
                position: 'relative',
                height: 40,
                width: 60,
                borderRadius: 2,
                cursor: 'pointer',
                transform: value?.id === theme.id ? '5px' : '',
                transition: '0.2s',
                backgroundImage: theme.value,
                /* Zoom nhẹ khi hover */
                '&:hover': {
                  transform: 'scale(1.1)'
                },
                // Lớp phủ overlay
                '&::after': {
                  content: '""',
                  borderRadius: 2,
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: value?.id === theme.id ? 'rgba(0, 0, 0, 0.15)' : 'transparent',
                  transition: '0.25s'
                },
                /* Icon check */
                '&::before': {
                  content: value?.id === theme.id ? '"✔"' : '""',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  color: '#fff',
                  fontSize: 16,
                  opacity: value?.id === theme.id ? 1 : 0,
                  transition: '0.25s',
                  zIndex: 2
                }
              }}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
