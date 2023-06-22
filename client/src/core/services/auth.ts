import { createApi } from '@reduxjs/toolkit/query/react'

import { apiRoutes } from '../api/api.endpoints'
import { baseQueryWithRefreshToken } from '../api/apiSlice'
import { browseRoutes } from '../config/routes.config'
import { User } from '../models/user'
import { logOut, setUser } from '../redux/slices/auth/slice'
import type { LoginFields, Tokens } from '../types'
import { ChangePasswordFormFields } from '../types/auth'
import { TokenService } from './token'

export const AuthService = createApi({
  reducerPath: 'AuthService',
  baseQuery: baseQueryWithRefreshToken,
  endpoints: (builder) => ({
    login: builder.mutation<{ tokens: Tokens; user: User }, LoginFields>({
      query(data) {
        return {
          body: data,
          method: 'POST',
          url: apiRoutes.auth.signIn(),
        }
      },
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const {
            data: { tokens, user },
          } = await queryFulfilled
          TokenService.setTokens(tokens)
          dispatch(setUser(user))
          // eslint-disable-next-line no-empty
        } catch (error) {}
      },
    }),
    logout: builder.mutation<void, void>({
      query() {
        return {
          url: apiRoutes.auth.logout(),
          method: 'GET',
        }
      },
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          TokenService.removeTokens()
          dispatch(logOut())
          window.location.href = browseRoutes.auth.login()
          // eslint-disable-next-line no-empty
        } catch (error) {}
      },
    }),
    changePassword: builder.mutation<{ tokens: Tokens }, ChangePasswordFormFields>({
      query(data) {
        return {
          body: data,
          method: 'POST',
          url: apiRoutes.auth.changePassword(),
        }
      },
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const {
            data: { tokens },
          } = await queryFulfilled
          TokenService.setTokens(tokens)
          // eslint-disable-next-line no-empty
        } catch (error) {}
      },
    }),
  }),
})

export const { useLoginMutation, useChangePasswordMutation } = AuthService
