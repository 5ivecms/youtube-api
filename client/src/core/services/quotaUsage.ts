import { createApi } from '@reduxjs/toolkit/query/react'

import { apiRoutes } from '../api/api.endpoints'
import { baseQueryWithRefreshToken } from '../api/apiSlice'
import { DeleteResponse } from '../types'
import { QuotaUsageModel } from '../types/quotaUsage'

export const QuotaUsageService = createApi({
  reducerPath: 'QuotaUsageService',
  baseQuery: baseQueryWithRefreshToken,
  tagTypes: ['QuotaUsage'],
  endpoints: (builder) => ({
    findAll: builder.query<QuotaUsageModel[], void>({
      query() {
        return {
          url: apiRoutes.quotaUsage.findAll(),
          method: 'GET',
        }
      },
      providesTags: (_result, _error) => [{ type: 'QuotaUsage' }],
    }),
    byPeriod: builder.query<QuotaUsageModel[], { startDate: Date; endDate: Date }>({
      query(params) {
        return {
          params,
          url: apiRoutes.quotaUsage.byPeriod(),
        }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: 'QuotaUsage' as const,
                id,
              })),
              { type: 'QuotaUsage', id: 'LIST' },
            ]
          : [{ type: 'QuotaUsage', id: 'LIST' }],
    }),
    clear: builder.mutation<DeleteResponse, void>({
      query() {
        return {
          url: apiRoutes.quotaUsage.clear(),
          method: 'DELETE',
        }
      },
      invalidatesTags: ['QuotaUsage'],
    }),
  }),
})
