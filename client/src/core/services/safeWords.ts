import { createApi } from '@reduxjs/toolkit/query/react'

import { apiRoutes } from '../api/api.endpoints'
import { baseQueryWithRefreshToken } from '../api/apiSlice'
import { DeleteResponse, FindAllResponse, UpdateResponse } from '../types'
import { CreateSafeWordsDto, SafeWordModel, SafeWorUpdateDto } from '../types/safeWords'
import { SearchParams } from '../types/search'

export const SafeWordsService = createApi({
  reducerPath: 'SafeWordsService',
  baseQuery: baseQueryWithRefreshToken,
  tagTypes: ['SafeWords'],
  endpoints: (builder) => ({
    findOne: builder.query<SafeWordModel, number>({
      query(id) {
        return {
          url: apiRoutes.safeWord.findOne(id),
          method: 'GET',
        }
      },
      providesTags: (_result, _error, id) => [{ type: 'SafeWords', id }],
    }),
    search: builder.query<FindAllResponse<SafeWordModel>, SearchParams<Record<string, string>>>({
      query(params) {
        return {
          params,
          url: apiRoutes.safeWord.search(),
        }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({
                type: 'SafeWords' as const,
                id,
              })),
              { type: 'SafeWords', id: 'LIST' },
            ]
          : [{ type: 'SafeWords', id: 'LIST' }],
    }),
    delete: builder.mutation<DeleteResponse, number>({
      query(hostId) {
        return {
          url: apiRoutes.safeWord.delete(hostId),
          method: 'DELETE',
        }
      },
      invalidatesTags: [{ type: 'SafeWords', id: 'LIST' }],
    }),
    deleteBulk: builder.mutation<DeleteResponse, number[]>({
      query(ids) {
        return {
          url: apiRoutes.safeWord.deleteBulk(),
          method: 'DELETE',
          body: { ids },
        }
      },
      invalidatesTags: (result, _, ids) =>
        result
          ? [
              ...ids.map((id) => ({
                type: 'SafeWords' as const,
                id,
              })),
              { type: 'SafeWords', id: 'LIST' },
            ]
          : [{ type: 'SafeWords', id: 'LIST' }],
    }),
    create: builder.mutation<SafeWordModel[], CreateSafeWordsDto>({
      query(phrases) {
        return {
          url: apiRoutes.safeWord.createBulk(),
          method: 'POST',
          body: phrases,
        }
      },
      invalidatesTags: [{ type: 'SafeWords', id: 'LIST' }],
    }),
    update: builder.mutation<UpdateResponse, SafeWorUpdateDto>({
      query({ id, ...data }) {
        return {
          url: apiRoutes.safeWord.update(id),
          method: 'PATCH',
          body: data,
        }
      },
      invalidatesTags: (result, _, { id }) =>
        result
          ? [
              { type: 'SafeWords', id },
              { type: 'SafeWords', id: 'LIST' },
            ]
          : [{ type: 'SafeWords', id: 'LIST' }],
    }),
    clear: builder.mutation<DeleteResponse, void>({
      query() {
        return {
          url: apiRoutes.safeWord.clear(),
          method: 'DELETE',
        }
      },
      invalidatesTags: ['SafeWords'],
    }),
  }),
})
