import { createApi } from '@reduxjs/toolkit/query/react'

import { apiRoutes } from '../api/api.endpoints'
import { baseQueryWithRefreshToken } from '../api/apiSlice'
import { DeleteResponse, FindAllResponse, UpdateResponse } from '../types'
import { SearchQueryParams } from '../types/search'
import { CreateBulkUseragentDto, UseragentModel, UseragentUpdateDto } from '../types/useragent'

export const UseragentService = createApi({
  reducerPath: 'UseragentService',
  baseQuery: baseQueryWithRefreshToken,
  tagTypes: ['Useragents'],
  endpoints: (builder) => ({
    findOne: builder.query<UseragentModel, number>({
      query(id) {
        return {
          url: apiRoutes.useragent.findOne(id),
          method: 'GET',
        }
      },
      providesTags: (_result, _error, id) => [{ type: 'Useragents', id }],
    }),
    search: builder.query<FindAllResponse<UseragentModel>, SearchQueryParams<UseragentModel>>({
      query(params) {
        return {
          params,
          url: apiRoutes.useragent.search(),
          method: 'GET',
        }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({
                type: 'Useragents' as const,
                id,
              })),
              { type: 'Useragents', id: 'LIST' },
            ]
          : [{ type: 'Useragents', id: 'LIST' }],
    }),
    clear: builder.mutation<DeleteResponse, void>({
      query() {
        return {
          url: apiRoutes.useragent.clear(),
          method: 'DELETE',
        }
      },
      invalidatesTags: ['Useragents'],
    }),
    create: builder.mutation<UseragentModel[], CreateBulkUseragentDto>({
      query(useragents) {
        return {
          url: apiRoutes.useragent.createBulk(),
          method: 'POST',
          body: useragents,
        }
      },
      invalidatesTags: [{ type: 'Useragents', id: 'LIST' }],
    }),
    update: builder.mutation<UpdateResponse, UseragentUpdateDto>({
      query({ id, ...data }) {
        return {
          url: apiRoutes.useragent.update(id),
          method: 'PATCH',
          body: data,
        }
      },
      invalidatesTags: (result, _, { id }) =>
        result
          ? [
              { type: 'Useragents', id },
              { type: 'Useragents', id: 'LIST' },
            ]
          : [{ type: 'Useragents', id: 'LIST' }],
    }),
    delete: builder.mutation<DeleteResponse, number>({
      query(useragentId) {
        return {
          url: apiRoutes.useragent.delete(useragentId),
          method: 'DELETE',
        }
      },
      invalidatesTags: [{ type: 'Useragents', id: 'LIST' }],
    }),
    deleteBulk: builder.mutation<DeleteResponse, number[]>({
      query(ids) {
        return {
          url: apiRoutes.useragent.deleteBulk(),
          method: 'DELETE',
          body: { ids },
        }
      },
      invalidatesTags: (result, _, ids) =>
        result
          ? [
              ...ids.map((id) => ({
                type: 'Useragents' as const,
                id,
              })),
              { type: 'Useragents', id: 'LIST' },
            ]
          : [{ type: 'Useragents', id: 'LIST' }],
    }),
  }),
})
