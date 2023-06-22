/* eslint-disable import/no-extraneous-dependencies */
import { Box, Paper } from '@mui/material'
import type { FC } from 'react'
import { Helmet } from 'react-helmet-async'
import { Navigate } from 'react-router-dom'

import { LoginForm } from '../../../components/auth'
import { browseRoutes } from '../../../core/config/routes.config'
import { selectCurrentUser } from '../../../core/redux/slices/auth/selectors'
import { useAppSelector } from '../../../core/redux/store'
import { styles } from './styles'

const LoginPage: FC = () => {
  const user = useAppSelector(selectCurrentUser)

  if (user) {
    return <Navigate to={browseRoutes.invidious.index()} replace />
  }

  return (
    <>
      <Helmet>
        <title>Авторизация</title>
      </Helmet>
      <Box sx={styles.container}>
        <Paper sx={styles.paper}>
          <LoginForm />
        </Paper>
      </Box>
    </>
  )
}

export default LoginPage
