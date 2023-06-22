import { createApi } from '@reduxjs/toolkit/query/react'

import { apiRoutes } from '../api/api.endpoints'
import { baseQueryWithRefreshToken } from '../api/apiSlice'
import { DeleteResponse, FindAllResponse, UpdateResponse } from '../types'
import { CreateBulkProxyDto, ProxyModel, UpdateProxyDto } from '../types/proxy'
import { SearchQueryParams } from '../types/search'

export const ProxyService = createApi({
  reducerPath: 'ProxyService',
  baseQuery: baseQueryWithRefreshToken,
  tagTypes: ['Proxies'],
  endpoints: (builder) => ({
    findOne: builder.query<ProxyModel, number>({
      query(id) {
        return {
          url: apiRoutes.proxy.findOne(id),
          method: 'GET',
        }
      },
      providesTags: (_result, _error, id) => [{ type: 'Proxies', id }],
    }),
    search: builder.query<FindAllResponse<ProxyModel>, SearchQueryParams<ProxyModel>>({
      query(params) {
        return {
          params,
          url: apiRoutes.proxy.search(),
          method: 'GET',
        }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({
                type: 'Proxies' as const,
                id,
              })),
              { type: 'Proxies', id: 'LIST' },
            ]
          : [{ type: 'Proxies', id: 'LIST' }],
    }),
    clear: builder.mutation<DeleteResponse, void>({
      query() {
        return {
          url: apiRoutes.proxy.clear(),
          method: 'DELETE',
        }
      },
      invalidatesTags: ['Proxies'],
    }),
    create: builder.mutation<ProxyModel[], CreateBulkProxyDto>({
      query(useragents) {
        return {
          url: apiRoutes.proxy.createBulk(),
          method: 'POST',
          body: useragents,
        }
      },
      invalidatesTags: [{ type: 'Proxies', id: 'LIST' }],
    }),
    update: builder.mutation<UpdateResponse, UpdateProxyDto>({
      query({ id, ...data }) {
        return {
          url: apiRoutes.proxy.update(id),
          method: 'PATCH',
          body: data,
        }
      },
      invalidatesTags: (result, _, { id }) =>
        result
          ? [
              { type: 'Proxies', id },
              { type: 'Proxies', id: 'LIST' },
            ]
          : [{ type: 'Proxies', id: 'LIST' }],
    }),
    delete: builder.mutation<DeleteResponse, number>({
      query(id) {
        return {
          url: apiRoutes.proxy.delete(id),
          method: 'DELETE',
        }
      },
      invalidatesTags: [{ type: 'Proxies', id: 'LIST' }],
    }),
    deleteBulk: builder.mutation<DeleteResponse, number[]>({
      query(ids) {
        return {
          url: apiRoutes.proxy.deleteBulk(),
          method: 'DELETE',
          body: { ids },
        }
      },
      invalidatesTags: (result, _, ids) =>
        result
          ? [
              ...ids.map((id) => ({
                type: 'Proxies' as const,
                id,
              })),
              { type: 'Proxies', id: 'LIST' },
            ]
          : [{ type: 'Proxies', id: 'LIST' }],
    }),
  }),
})
