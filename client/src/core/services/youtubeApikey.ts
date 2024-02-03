import { createApi } from '@reduxjs/toolkit/query/react'

import { apiRoutes } from '../api/api.endpoints'
import { baseQueryWithRefreshToken } from '../api/apiSlice'
import { DeleteResponse, FindAllResponse, UpdateResponse } from '../types'
import { SearchQueryParams } from '../types/search'
import { CreateBulkYoutubeApikeyDto, YoutubeApikeyModel, YoutubeApikeyUpdateDto } from '../types/youtubeApikey'

export const YoutubeApikeyService = createApi({
  reducerPath: 'YoutubeApikeyService',
  baseQuery: baseQueryWithRefreshToken,
  tagTypes: ['YoutubeApikeys'],
  endpoints: (builder) => ({
    findAll: builder.query<YoutubeApikeyModel[], void>({
      query() {
        return {
          url: apiRoutes.youtubeApikey.findAll(),
          method: 'GET',
        }
      },
    }),
    findOne: builder.query<YoutubeApikeyModel, number>({
      query(id) {
        return {
          url: apiRoutes.youtubeApikey.findOne(id),
          method: 'GET',
        }
      },
      providesTags: (_result, _error, id) => [{ type: 'YoutubeApikeys', id }],
    }),
    statisitc: builder.query<{ total: number; today: number }, void>({
      query() {
        return {
          url: apiRoutes.youtubeApikey.statistic(),
          method: 'GET',
        }
      },
    }),
    search: builder.query<FindAllResponse<YoutubeApikeyModel>, SearchQueryParams<YoutubeApikeyModel>>({
      query(params) {
        return {
          params,
          url: apiRoutes.youtubeApikey.search(),
          method: 'GET',
        }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({
                type: 'YoutubeApikeys' as const,
                id,
              })),
              { type: 'YoutubeApikeys', id: 'LIST' },
            ]
          : [{ type: 'YoutubeApikeys', id: 'LIST' }],
    }),
    clear: builder.mutation<DeleteResponse, void>({
      query() {
        return {
          url: apiRoutes.youtubeApikey.clear(),
          method: 'DELETE',
        }
      },
      invalidatesTags: ['YoutubeApikeys'],
    }),
    create: builder.mutation<YoutubeApikeyModel, CreateBulkYoutubeApikeyDto>({
      query(data) {
        return {
          url: apiRoutes.youtubeApikey.createBulk(),
          method: 'POST',
          body: data,
        }
      },
      invalidatesTags: [{ type: 'YoutubeApikeys', id: 'LIST' }],
    }),
    resetAllErrors: builder.mutation<void, void>({
      query() {
        return {
          url: apiRoutes.youtubeApikey.resetAllErrors(),
          method: 'POST',
        }
      },
      invalidatesTags: [{ type: 'YoutubeApikeys', id: 'LIST' }],
    }),
    resetQuotaErrors: builder.mutation<void, void>({
      query() {
        return {
          url: apiRoutes.youtubeApikey.resetQuotaErrors(),
          method: 'POST',
        }
      },
      invalidatesTags: [{ type: 'YoutubeApikeys', id: 'LIST' }],
    }),
    update: builder.mutation<UpdateResponse, YoutubeApikeyUpdateDto>({
      query({ id, ...data }) {
        return {
          url: apiRoutes.youtubeApikey.update(id),
          method: 'PATCH',
          body: data,
        }
      },
      invalidatesTags: (result, _, { id }) =>
        result
          ? [
              { type: 'YoutubeApikeys', id },
              { type: 'YoutubeApikeys', id: 'LIST' },
            ]
          : [{ type: 'YoutubeApikeys', id: 'LIST' }],
    }),
    delete: builder.mutation<DeleteResponse, number>({
      query(id) {
        return {
          url: apiRoutes.youtubeApikey.delete(id),
          method: 'DELETE',
        }
      },
      invalidatesTags: [{ type: 'YoutubeApikeys', id: 'LIST' }],
    }),
    deleteBulk: builder.mutation<DeleteResponse, number[]>({
      query(ids) {
        return {
          url: apiRoutes.youtubeApikey.deleteBulk(),
          method: 'DELETE',
          body: { ids },
        }
      },
      invalidatesTags: (result, _, ids) =>
        result
          ? [
              ...ids.map((id) => ({
                type: 'YoutubeApikeys' as const,
                id,
              })),
              { type: 'YoutubeApikeys', id: 'LIST' },
            ]
          : [{ type: 'YoutubeApikeys', id: 'LIST' }],
    }),
  }),
})
