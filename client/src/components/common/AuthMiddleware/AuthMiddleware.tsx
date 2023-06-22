import { FC, ReactElement } from 'react'

import { UserService } from '../../../core/services'
import { FullScreenLoader } from '../../ui'

interface AuthMiddlewareProps {
  children: ReactElement
}

const AuthMiddleware: FC<AuthMiddlewareProps> = ({ children }) => {
  const { isLoading, isFetching } = UserService.endpoints.profile.useQuery(null, {
    refetchOnMountOrArgChange: true,
    skip: false,
  })

  const loading = isLoading || isFetching
  if (loading) {
    return <FullScreenLoader />
  }

  return children
}

export default AuthMiddleware
