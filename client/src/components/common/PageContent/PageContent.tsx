import { Box } from '@mui/material'
import type { FC, ReactNode } from 'react'

import Preloader from '../../ui/Preloader/Preloader'
import { style } from './style.sx'

interface PageContentProps {
  children: ReactNode
  loading: boolean
}

const PageContent: FC<PageContentProps> = ({ loading, children }) => {
  return <Box sx={style}>{loading ? <Preloader /> : children}</Box>
}

export default PageContent
