import { createApi } from '@reduxjs/toolkit/query/react'

import { baseQueryWithRefreshToken } from '../api/apiSlice'
import type { User } from '../models/user'
import { setUser } from '../redux/slices/auth/slice'

export const UserService = createApi({
  reducerPath: 'UserService',
  baseQuery: baseQueryWithRefreshToken,
  endpoints: (builder) => ({
    profile: builder.query<User, null>({
      query() {
        return {
          url: 'user/profile',
          method: 'GET',
        }
      },
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(setUser(data))
          // eslint-disable-next-line no-empty
        } catch (error) {}
      },
    }),
  }),
})
