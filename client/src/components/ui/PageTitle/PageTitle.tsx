import { Typography } from '@mui/material'
import type { FC } from 'react'

interface PageTitleProps {
  title: string
}

const PageTitle: FC<PageTitleProps> = ({ title }) => (
  <Typography component="h1" variant="h4">
    {title}
  </Typography>
)

export default PageTitle
