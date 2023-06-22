import { Box, CircularProgress, circularProgressClasses } from '@mui/material'
import { FC } from 'react'

import { styles } from './styles'

const FullScreenLoader: FC = () => {
  return (
    <Box sx={styles.container}>
      <Box sx={{ width: 80, height: 80, ...styles.body }}>
        <CircularProgress
          variant="determinate"
          sx={{
            color: (theme) => theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
          }}
          size={80}
          thickness={4}
          value={100}
        />
        <CircularProgress
          variant="indeterminate"
          disableShrink
          sx={{
            animationDuration: '550ms',
            position: 'absolute',
            left: 0,
            [`& .${circularProgressClasses.circle}`]: {
              strokeLinecap: 'round',
            },
          }}
          size={80}
          thickness={4}
        />
      </Box>
    </Box>
  )
}

export default FullScreenLoader
