import { createApi } from '@reduxjs/toolkit/query/react'

import { apiRoutes } from '../api/api.endpoints'
import { baseQueryWithRefreshToken } from '../api/apiSlice'
import { DeleteResponse, FindAllResponse, UpdateResponse } from '../types'
import { SearchParams } from '../types/search'
import { CreateVideoBlacklistsDto, VideoBlacklistModel, VideoBlacklistUpdateDto } from '../types/video-blacklist'

export const VideoBlacklistService = createApi({
  reducerPath: 'VideoBlacklistService',
  baseQuery: baseQueryWithRefreshToken,
  tagTypes: ['VideoBlacklist'],
  endpoints: (builder) => ({
    findOne: builder.query<VideoBlacklistModel, number>({
      query(id) {
        return {
          url: apiRoutes.videoBlacklist.findOne(id),
          method: 'GET',
        }
      },
      providesTags: (_result, _error, id) => [{ type: 'VideoBlacklist', id }],
    }),
    search: builder.query<FindAllResponse<VideoBlacklistModel>, SearchParams<Record<string, string>>>({
      query(params) {
        return {
          params,
          url: apiRoutes.videoBlacklist.search(),
        }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({
                type: 'VideoBlacklist' as const,
                id,
              })),
              { type: 'VideoBlacklist', id: 'LIST' },
            ]
          : [{ type: 'VideoBlacklist', id: 'LIST' }],
    }),
    delete: builder.mutation<DeleteResponse, number>({
      query(hostId) {
        return {
          url: apiRoutes.videoBlacklist.delete(hostId),
          method: 'DELETE',
        }
      },
      invalidatesTags: [{ type: 'VideoBlacklist', id: 'LIST' }],
    }),
    deleteBulk: builder.mutation<DeleteResponse, number[]>({
      query(ids) {
        return {
          url: apiRoutes.videoBlacklist.deleteBulk(),
          method: 'DELETE',
          body: { ids },
        }
      },
      invalidatesTags: (result, _, ids) =>
        result
          ? [
              ...ids.map((id) => ({
                type: 'VideoBlacklist' as const,
                id,
              })),
              { type: 'VideoBlacklist', id: 'LIST' },
            ]
          : [{ type: 'VideoBlacklist', id: 'LIST' }],
    }),
    create: builder.mutation<VideoBlacklistModel[], CreateVideoBlacklistsDto>({
      query(videoIds) {
        return {
          url: apiRoutes.videoBlacklist.createBulk(),
          method: 'POST',
          body: videoIds,
        }
      },
      invalidatesTags: [{ type: 'VideoBlacklist', id: 'LIST' }],
    }),
    update: builder.mutation<UpdateResponse, { id: number; data: VideoBlacklistUpdateDto }>({
      query({ id, data }) {
        return {
          url: apiRoutes.videoBlacklist.update(id),
          method: 'PATCH',
          body: data,
        }
      },
      invalidatesTags: (result, _, { id }) =>
        result
          ? [
              { type: 'VideoBlacklist', id },
              { type: 'VideoBlacklist', id: 'LIST' },
            ]
          : [{ type: 'VideoBlacklist', id: 'LIST' }],
    }),
    clear: builder.mutation<DeleteResponse, void>({
      query() {
        return {
          url: apiRoutes.videoBlacklist.clear(),
          method: 'DELETE',
        }
      },
      invalidatesTags: ['VideoBlacklist'],
    }),
  }),
})
