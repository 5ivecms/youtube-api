import type { FC } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { browseRoutes } from '../core/config/routes.config'
import { UserService } from '../core/services'

const PrivateRoute: FC = () => {
  const location = useLocation()

  const { data, isLoading, isFetching } = UserService.endpoints.profile.useQuery(null, {
    skip: false,
  })

  const loading = isLoading || isFetching

  if (loading) {
    return <></>
  }

  return data ? <Outlet /> : <Navigate state={{ from: location }} to={browseRoutes.auth.login()} replace />
}

export default PrivateRoute
