import { SxProps } from '@mui/material'
import { grey } from '@mui/material/colors'

export const actionButtons: SxProps = {
  '& > button, & > a': { ml: 1 },
  whiteSpace: 'nowrap',
}

export const hostComment: SxProps = {
  fontSize: '12px',
  color: grey[500],
}
