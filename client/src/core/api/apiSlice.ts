/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { BaseQueryApi, FetchArgs } from '@reduxjs/toolkit/query/react'
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { API_URL } from '../config/api.config'
import { browseRoutes } from '../config/routes.config'
import { logOut } from '../redux/slices/auth/slice'
import { TokenService } from '../services/token'
import { Tokens } from '../types'
import { apiRoutes } from './api.endpoints'

const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  prepareHeaders: (headers) => {
    const token = TokenService.getAccessToken() || ''
    if (token && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${token}`)
    }
    return headers
  },
})

export const baseQueryWithRefreshToken = async (args: FetchArgs | string, api: BaseQueryApi, extraOptions: object) => {
  let result = await baseQuery(args, api, extraOptions)

  if (result?.error?.status === 401) {
    const refreshToken = TokenService.getRefreshToken() || ''

    const refreshResult = await baseQuery(
      {
        headers: { Authorization: `Bearer ${refreshToken}` },
        url: apiRoutes.auth.refresh(),
      },
      api,
      extraOptions
    )

    if (refreshResult?.data) {
      TokenService.setTokens(refreshResult.data as Tokens)
      result = await baseQuery(args, api, extraOptions)
    } else {
      TokenService.removeTokens()
      api.dispatch(logOut())
      if (window.location.pathname.indexOf(browseRoutes.auth.login()) === -1) {
        window.location.href = browseRoutes.auth.login()
      }
    }
  }

  return result
}
