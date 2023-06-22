import { Box } from '@mui/material'
import type { FC, ReactElement } from 'react'

type AuthLayoutProps = {
  children: ReactElement
}

const AuthLayout: FC<AuthLayoutProps> = ({ children }) => {
  return <Box>{children}</Box>
}

export default AuthLayout
