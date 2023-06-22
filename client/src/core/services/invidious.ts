import { createApi } from '@reduxjs/toolkit/query/react'

import { apiRoutes } from '../api/api.endpoints'
import { baseQueryWithRefreshToken } from '../api/apiSlice'
import type { DeleteResponse, FindAllResponse, UpdateResponse } from '../types'
import type { CreateInvidiousDto, InvidiousModel, UpdateInvidiousDto } from '../types/invidious'
import { LogsModel } from '../types/logs'
import type { SearchParams } from '../types/search'

export const InvidiousService = createApi({
  reducerPath: 'InvidiousService',
  baseQuery: baseQueryWithRefreshToken,
  tagTypes: ['InvidiousHosts'],
  endpoints: (builder) => ({
    findOne: builder.query<InvidiousModel, number>({
      query(id) {
        return {
          url: apiRoutes.invidious.findOne(id),
          method: 'GET',
        }
      },
      providesTags: (_result, _error, id) => [{ type: 'InvidiousHosts', id }],
    }),
    getLogs: builder.query<LogsModel[], number>({
      query(id) {
        return {
          url: apiRoutes.invidious.getLogs(id),
          method: 'GET',
        }
      },
    }),
    search: builder.query<FindAllResponse<InvidiousModel>, SearchParams<Record<string, string>>>({
      query(params) {
        return {
          params,
          url: apiRoutes.invidious.search(),
        }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({
                type: 'InvidiousHosts' as const,
                id,
              })),
              { type: 'InvidiousHosts', id: 'LIST' },
            ]
          : [{ type: 'InvidiousHosts', id: 'LIST' }],
    }),
    delete: builder.mutation<DeleteResponse, number>({
      query(hostId) {
        return {
          url: apiRoutes.invidious.delete(hostId),
          method: 'DELETE',
        }
      },
      invalidatesTags: [{ type: 'InvidiousHosts', id: 'LIST' }],
    }),
    deleteBulk: builder.mutation<DeleteResponse, number[]>({
      query(ids) {
        return {
          url: apiRoutes.invidious.deleteBulk(),
          method: 'DELETE',
          body: { ids },
        }
      },
      invalidatesTags: [{ type: 'InvidiousHosts', id: 'LIST' }],
    }),
    create: builder.mutation<InvidiousModel, CreateInvidiousDto>({
      query(data) {
        return {
          url: apiRoutes.invidious.create(),
          method: 'POST',
          body: data,
        }
      },
      invalidatesTags: [{ type: 'InvidiousHosts', id: 'LIST' }],
    }),
    update: builder.mutation<UpdateResponse, UpdateInvidiousDto>({
      query({ id, ...data }) {
        return {
          url: apiRoutes.invidious.update(id),
          method: 'PATCH',
          body: data,
        }
      },
      invalidatesTags: (result, _, { id }) =>
        result
          ? [
              { type: 'InvidiousHosts', id },
              { type: 'InvidiousHosts', id: 'LIST' },
            ]
          : [{ type: 'InvidiousHosts', id: 'LIST' }],
    }),
    healthCheck: builder.mutation<InvidiousModel, number>({
      query(id) {
        return {
          url: apiRoutes.invidious.healthCheck(id),
          method: 'POST',
        }
      },
      invalidatesTags: (result, _, id) =>
        result
          ? [
              { type: 'InvidiousHosts', id },
              { type: 'InvidiousHosts', id: 'LIST' },
            ]
          : [{ type: 'InvidiousHosts', id: 'LIST' }],
    }),
    healthCheckAll: builder.mutation<InvidiousModel, void>({
      query() {
        return {
          url: apiRoutes.invidious.healthCheckAll(),
          method: 'POST',
        }
      },
      invalidatesTags: [{ type: 'InvidiousHosts', id: 'LIST' }],
    }),
    resetState: builder.mutation<InvidiousModel, void>({
      query() {
        return {
          url: apiRoutes.invidious.resetState(),
          method: 'POST',
        }
      },
      invalidatesTags: [{ type: 'InvidiousHosts', id: 'LIST' }],
    }),
    loadHosts: builder.mutation<InvidiousModel, void>({
      query() {
        return {
          url: apiRoutes.invidious.loadHosts(),
          method: 'POST',
        }
      },
      invalidatesTags: [{ type: 'InvidiousHosts', id: 'LIST' }],
    }),
  }),
})
