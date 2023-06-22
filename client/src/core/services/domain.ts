import { createApi } from '@reduxjs/toolkit/query/react'

import { apiRoutes } from '../api/api.endpoints'
import { baseQueryWithRefreshToken } from '../api/apiSlice'
import { DeleteResponse, FindAllResponse, UpdateResponse } from '../types'
import { CreateDomainDto, DomainModel, UpdateDomainDto } from '../types/domain'
import { SearchQueryParams } from '../types/search'

export const DomainService = createApi({
  reducerPath: 'DomainService',
  baseQuery: baseQueryWithRefreshToken,
  tagTypes: ['Domains'],
  endpoints: (builder) => ({
    findOne: builder.query<DomainModel, number>({
      query(id) {
        return {
          url: apiRoutes.domain.findOne(id),
          method: 'GET',
        }
      },
      providesTags: (_result, _error, id) => [{ type: 'Domains', id }],
    }),
    search: builder.query<FindAllResponse<DomainModel>, SearchQueryParams<DomainModel>>({
      query(params) {
        return {
          params,
          url: apiRoutes.domain.search(),
          method: 'GET',
        }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({
                type: 'Domains' as const,
                id,
              })),
              { type: 'Domains', id: 'LIST' },
            ]
          : [{ type: 'Domains', id: 'LIST' }],
    }),
    clear: builder.mutation<DeleteResponse, void>({
      query() {
        return {
          url: apiRoutes.domain.clear(),
          method: 'DELETE',
        }
      },
      invalidatesTags: ['Domains'],
    }),
    create: builder.mutation<DomainModel[], CreateDomainDto>({
      query(data) {
        return {
          url: apiRoutes.domain.create(),
          method: 'POST',
          body: data,
        }
      },
      invalidatesTags: [{ type: 'Domains', id: 'LIST' }],
    }),
    update: builder.mutation<UpdateResponse, UpdateDomainDto>({
      query({ id, ...data }) {
        return {
          url: apiRoutes.domain.update(id),
          method: 'PATCH',
          body: data,
        }
      },
      invalidatesTags: (result, _, { id }) =>
        result
          ? [
              { type: 'Domains', id },
              { type: 'Domains', id: 'LIST' },
            ]
          : [{ type: 'Domains', id: 'LIST' }],
    }),
    delete: builder.mutation<DeleteResponse, number>({
      query(id) {
        return {
          url: apiRoutes.domain.delete(id),
          method: 'DELETE',
        }
      },
      invalidatesTags: [{ type: 'Domains', id: 'LIST' }],
    }),
    deleteBulk: builder.mutation<DeleteResponse, number[]>({
      query(ids) {
        return {
          url: apiRoutes.domain.deleteBulk(),
          method: 'DELETE',
          body: { ids },
        }
      },
      invalidatesTags: (result, _, ids) =>
        result
          ? [
              ...ids.map((id) => ({
                type: 'Domains' as const,
                id,
              })),
              { type: 'Domains', id: 'LIST' },
            ]
          : [{ type: 'Domains', id: 'LIST' }],
    }),
  }),
})
