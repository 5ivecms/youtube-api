import { Box, CircularProgress } from '@mui/material'
import type { FC } from 'react'

import { styles } from './style.sx'

const DataGridLoader: FC = () => (
  <Box sx={styles.container}>
    <CircularProgress size={50} />
  </Box>
)

export default DataGridLoader
