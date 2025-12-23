import { SvgIcon } from '@mui/material'

function CrownIcon(props) {
  return (
    <SvgIcon {...props}>
      {/* Đây là path của icon Crown từ Lucide */}
      <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </SvgIcon>
  )
}

export default CrownIcon
