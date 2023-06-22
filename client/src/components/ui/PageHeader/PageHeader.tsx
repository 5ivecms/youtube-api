/* eslint-disable react/require-default-props */
import { ArrowBackIosNewOutlined } from '@mui/icons-material'
import { Box, IconButton, Typography } from '@mui/material'
import type { FC, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

import { backIconSx, pageHeaderContainer, pageHeaderLeftSx } from './style.sx'

interface PageHeaderProps {
  right?: ReactNode
  showBackButton?: boolean
  title: string
}

const PageHeader: FC<PageHeaderProps> = ({ title, right, showBackButton = false }) => {
  const navigate = useNavigate()

  const goBack = (): void => {
    navigate(-1)
  }

  return (
    <Box sx={pageHeaderContainer}>
      <Box sx={pageHeaderLeftSx}>
        {showBackButton && (
          <IconButton aria-label="back" color="info" onClick={goBack} size="medium" sx={backIconSx}>
            <ArrowBackIosNewOutlined />
          </IconButton>
        )}
        <Typography component="h1" variant="h4">
          {title}
        </Typography>
      </Box>
      <Box>{right || <></>}</Box>
    </Box>
  )
}

export default PageHeader
