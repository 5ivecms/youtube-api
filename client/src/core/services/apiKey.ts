import { createApi } from '@reduxjs/toolkit/query/react'

import { apiRoutes } from '../api/api.endpoints'
import { baseQueryWithRefreshToken } from '../api/apiSlice'
import { DeleteResponse, FindAllResponse, UpdateResponse } from '../types'
import { ApiKeyModel, ApiKeyUpdateDto, CreateApiKeyDto } from '../types/apiKey'
import { SearchQueryParams } from '../types/search'

export const ApiKeyService = createApi({
  reducerPath: 'ApiKeyService',
  baseQuery: baseQueryWithRefreshToken,
  tagTypes: ['ApiKeys'],
  endpoints: (builder) => ({
    findOne: builder.query<ApiKeyModel, number>({
      query(id) {
        return {
          url: apiRoutes.apiKey.findOne(id),
          method: 'GET',
        }
      },
      providesTags: (_result, _error, id) => [{ type: 'ApiKeys', id }],
    }),
    search: builder.query<FindAllResponse<ApiKeyModel>, SearchQueryParams<ApiKeyModel>>({
      query(params) {
        return {
          params,
          url: apiRoutes.apiKey.search(),
          method: 'GET',
        }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({
                type: 'ApiKeys' as const,
                id,
              })),
              { type: 'ApiKeys', id: 'LIST' },
            ]
          : [{ type: 'ApiKeys', id: 'LIST' }],
    }),
    clear: builder.mutation<DeleteResponse, void>({
      query() {
        return {
          url: apiRoutes.apiKey.clear(),
          method: 'DELETE',
        }
      },
      invalidatesTags: ['ApiKeys'],
    }),
    create: builder.mutation<ApiKeyModel, CreateApiKeyDto>({
      query(data) {
        return {
          url: apiRoutes.apiKey.create(),
          method: 'POST',
          body: data,
        }
      },
      invalidatesTags: [{ type: 'ApiKeys', id: 'LIST' }],
    }),
    update: builder.mutation<UpdateResponse, ApiKeyUpdateDto>({
      query({ id, ...data }) {
        return {
          url: apiRoutes.apiKey.update(id),
          method: 'PATCH',
          body: data,
        }
      },
      invalidatesTags: (result, _, { id }) =>
        result
          ? [
              { type: 'ApiKeys', id },
              { type: 'ApiKeys', id: 'LIST' },
            ]
          : [{ type: 'ApiKeys', id: 'LIST' }],
    }),
    delete: builder.mutation<DeleteResponse, number>({
      query(id) {
        return {
          url: apiRoutes.apiKey.delete(id),
          method: 'DELETE',
        }
      },
      invalidatesTags: [{ type: 'ApiKeys', id: 'LIST' }],
    }),
    deleteBulk: builder.mutation<DeleteResponse, number[]>({
      query(ids) {
        return {
          url: apiRoutes.apiKey.deleteBulk(),
          method: 'DELETE',
          body: { ids },
        }
      },
      invalidatesTags: (result, _, ids) =>
        result
          ? [
              ...ids.map((id) => ({
                type: 'ApiKeys' as const,
                id,
              })),
              { type: 'ApiKeys', id: 'LIST' },
            ]
          : [{ type: 'ApiKeys', id: 'LIST' }],
    }),
  }),
})
