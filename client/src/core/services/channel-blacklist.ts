import { createApi } from '@reduxjs/toolkit/query/react'

import { apiRoutes } from '../api/api.endpoints'
import { baseQueryWithRefreshToken } from '../api/apiSlice'
import { DeleteResponse, FindAllResponse, UpdateResponse } from '../types'
import {
  ChannelBlacklistModel,
  ChannelBlacklistUpdateDto,
  CreateChannelBlacklistsDto,
} from '../types/channel-blacklist'
import { SearchParams } from '../types/search'

export const ChannelBlacklistService = createApi({
  reducerPath: 'ChannelBlacklistService',
  baseQuery: baseQueryWithRefreshToken,
  tagTypes: ['ChannelBlacklist'],
  endpoints: (builder) => ({
    findOne: builder.query<ChannelBlacklistModel, number>({
      query(id) {
        return {
          url: apiRoutes.channelBlacklist.findOne(id),
          method: 'GET',
        }
      },
      providesTags: (_result, _error, id) => [{ type: 'ChannelBlacklist', id }],
    }),
    search: builder.query<FindAllResponse<ChannelBlacklistModel>, SearchParams<Record<string, string>>>({
      query(params) {
        return {
          params,
          url: apiRoutes.channelBlacklist.search(),
        }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({
                type: 'ChannelBlacklist' as const,
                id,
              })),
              { type: 'ChannelBlacklist', id: 'LIST' },
            ]
          : [{ type: 'ChannelBlacklist', id: 'LIST' }],
    }),
    delete: builder.mutation<DeleteResponse, number>({
      query(videoId) {
        return {
          url: apiRoutes.channelBlacklist.delete(videoId),
          method: 'DELETE',
        }
      },
      invalidatesTags: [{ type: 'ChannelBlacklist', id: 'LIST' }],
    }),
    deleteBulk: builder.mutation<DeleteResponse, number[]>({
      query(channelIds) {
        return {
          url: apiRoutes.channelBlacklist.deleteBulk(),
          method: 'DELETE',
          body: { channelIds },
        }
      },
      invalidatesTags: (result, _, ids) =>
        result
          ? [
              ...ids.map((id) => ({
                type: 'ChannelBlacklist' as const,
                id,
              })),
              { type: 'ChannelBlacklist', id: 'LIST' },
            ]
          : [{ type: 'ChannelBlacklist', id: 'LIST' }],
    }),
    create: builder.mutation<ChannelBlacklistModel[], CreateChannelBlacklistsDto>({
      query(channelIds) {
        return {
          url: apiRoutes.channelBlacklist.createBulk(),
          method: 'POST',
          body: channelIds,
        }
      },
      invalidatesTags: [{ type: 'ChannelBlacklist', id: 'LIST' }],
    }),
    update: builder.mutation<UpdateResponse, { id: number; data: ChannelBlacklistUpdateDto }>({
      query({ id, data }) {
        return {
          url: apiRoutes.channelBlacklist.update(id),
          method: 'PATCH',
          body: data,
        }
      },
      invalidatesTags: (result, _, { id }) =>
        result
          ? [
              { type: 'ChannelBlacklist', id },
              { type: 'ChannelBlacklist', id: 'LIST' },
            ]
          : [{ type: 'ChannelBlacklist', id: 'LIST' }],
    }),
    clear: builder.mutation<DeleteResponse, void>({
      query() {
        return {
          url: apiRoutes.channelBlacklist.clear(),
          method: 'DELETE',
        }
      },
      invalidatesTags: ['ChannelBlacklist'],
    }),
  }),
})
