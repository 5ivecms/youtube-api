/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/require-default-props */
import { Box, Container } from '@mui/material'
import type { FC, ReactNode } from 'react'
import { Helmet } from 'react-helmet-async'

import { Footer, Header } from '../../components/common'
import { container, main } from './AdminLayout.styles'

interface Props {
  title?: string
  children: ReactNode
}

const AdminLayout: FC<Props> = ({ children, title = '' }) => {
  return (
    <>
      {title && (
        <Helmet>
          <title>{title}</title>
        </Helmet>
      )}

      <Box sx={main}>
        <Header />
        <Container sx={container} maxWidth="xl">
          {children}
        </Container>
        <Footer />
      </Box>
    </>
  )
}

export default AdminLayout
