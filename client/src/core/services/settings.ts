import { createApi } from '@reduxjs/toolkit/query/react'

import { apiRoutes } from '../api/api.endpoints'
import { baseQueryWithRefreshToken } from '../api/apiSlice'
import { UpdateResponse } from '../types'
import { SettingsModel, UpdateSettingDto } from '../types/settings'

export const SettingsService = createApi({
  reducerPath: 'SettingsService',
  baseQuery: baseQueryWithRefreshToken,
  tagTypes: ['Settings'],
  endpoints: (builder) => ({
    findAll: builder.query<SettingsModel[], void>({
      query() {
        return {
          url: apiRoutes.settings.findAll(),
        }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: 'Settings' as const,
                id,
              })),
              { type: 'Settings', id: 'LIST' },
            ]
          : [{ type: 'Settings', id: 'LIST' }],
    }),
    updateBulk: builder.mutation<UpdateResponse[], UpdateSettingDto[]>({
      query(settings) {
        return {
          url: apiRoutes.settings.updateBulk(),
          method: 'PATCH',
          body: { settings },
        }
      },
      invalidatesTags: [{ type: 'Settings', id: 'LIST' }],
    }),
    resetCache: builder.mutation<void, void>({
      query() {
        return {
          url: apiRoutes.settings.resetCache(),
          method: 'POST',
        }
      },
    }),
  }),
})
