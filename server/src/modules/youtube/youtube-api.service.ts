import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import axios, { AxiosResponse } from 'axios'
import { format, register } from 'timeago.js'
import ruLocale from 'timeago.js/lib/lang/ru'
import { HttpsProxyAgent } from 'hpagent'
import { LanguageCode } from 'cld3-asm'

import { YoutubeApikeyService } from './youtube-apikey.service'
import { AVAILABLE_CATEGORY_IDS, QuotaCosts, YTApiEndpoints } from './constants'
import {
  SearchResponse,
  VideoListResponse,
  VideoCategoriesResponse,
  VideoFullResponse,
  YTError,
  ChannelListResponse,
  PlaylistItemListResponse,
  CommentThreadListResponse,
  Video,
  Category,
  Comment,
  CategoryWithVideos,
  FullVideoData,
} from './youtube-api.types'
import {
  YoutubeApiCommentsDto,
  YoutubeApiSearchDto,
  YoutubeApiVideoByCategoryIdDto,
  YoutubeApiVideoByChannelIdDto,
  YoutubeApiVideoById,
  YoutubeApiVideoByPlaylistId,
} from './dto'
import { convertDurationToSeconds, convertTimeToFormat, getDurationParts } from '../../utils'
import { QuotaUsageService } from '../quota-usage/quota-usage.service'
import { YoutubeApikey } from './youtube-apikey.entity'
import { SettingsService } from '../settings/settings.service'
import { YoutubeCacheProvider } from './youtube-cache.provider'
import { PlaylistNotFound, VideoNotFound } from './exceptions'
import { YoutubeFilterProvider } from './youtube-filter.provider'

register('ru', ruLocale)

// Видео без комментариев iWcBrz0YWyE
// http://localhost:9090/channel/UC-wWyFdk_txbZV8FKEk0V8A/ украинский канал
// http://localhost:9090/channel/UCBExEyByJmPydFVVFcGeOqQ/ Много хештегов. Их надо удалить чтобы повысить качество определения языка

@Injectable()
export class YoutubeApiService {
  constructor(
    private readonly cacheProvider: YoutubeCacheProvider,
    private readonly filter: YoutubeFilterProvider,
    private readonly youtubeApikeyService: YoutubeApikeyService,
    private readonly quotaUsageService: QuotaUsageService,
    private readonly settingsService: SettingsService
  ) {}

  public async search(dto: YoutubeApiSearchDto): Promise<Video[]> {
    if (!this.filter.isAcceptableCountryByText(dto.q) || !(await this.filter.isAcceptablePhrase(dto.q))) {
      return []
    }

    const cachedVideo = await this.cacheProvider.getSearchCache(dto.q)
    if (cachedVideo) {
      return await this.filter.getWhiteVideos(cachedVideo)
    }

    let result: SearchResponse | null = null

    while (!result) {
      const apiKey = await this.youtubeApikeyService.getNextKey()

      try {
        const response = await this.request<SearchResponse>(apiKey, YTApiEndpoints.search, {
          part: 'snippet',
          maxResults: '50',
          regionCode: 'RU',
          type: 'video',
          q: dto.q,
          lr: 'ru_RU',
          relevanceLanguage: 'ru',
          safeSearch: 'strict',
          videoEmbeddable: true,
          videoSyndicated: true,
        })

        if (response.data) {
          result = response.data
        }

        await this.updateQuota(apiKey, QuotaCosts.SEARCH_LIST)
      } catch (e) {
        await this.updateQuota(apiKey, QuotaCosts.SEARCH_LIST)

        if (this.isQuotaError(e)) {
          await this.setError(apiKey.id, e)
          continue
        }

        if (e?.response?.data?.error?.code === 403) {
          await this.setError(apiKey.id, e)
          break
        }

        if (e?.response?.data?.error?.code === 404) {
          throw new NotFoundException()
        }

        throw new BadRequestException()
      }
    }

    const snippets: Record<string, string> = result.items.reduce(
      (acc, item) => ({ ...acc, [item.id.videoId]: item.snippet.description }),
      {}
    )

    const videoIds = result.items.map((item) => item.id.videoId)
    const videos = await this.videoByIds({ videoId: videoIds.join(',') })
    const data: Video[] = videos.map((video) => ({ ...video, snippet: snippets[video.id] }))

    await this.cacheProvider.setSearchCache(dto.q, data)

    return data
  }

  public async categories(): Promise<Category[]> {
    const cachedCategories = await this.cacheProvider.getCategoriesCache()
    if (cachedCategories) {
      return cachedCategories
    }

    let result: VideoCategoriesResponse | null = null

    while (!result) {
      const apiKey = await this.youtubeApikeyService.getNextKey()
      try {
        const response = await this.request<VideoCategoriesResponse>(apiKey, YTApiEndpoints.videoCategories, {
          part: 'snippet',
          regionCode: 'RU',
          hl: 'ru_RU',
        })

        if (response.data) {
          result = response.data
        }

        await this.updateQuota(apiKey, QuotaCosts.VIDEO_CATEGORIES_LIST)
      } catch (e) {
        await this.updateQuota(apiKey, QuotaCosts.VIDEO_CATEGORIES_LIST)

        if (this.isQuotaError(e)) {
          await this.setError(apiKey.id, e)
          continue
        }

        if (e?.response?.data?.error?.code === 403) {
          await this.setError(apiKey.id, e)
          break
        }

        if (e?.response?.data?.error?.code === 404) {
          throw new NotFoundException()
        }

        throw new BadRequestException()
      }
    }

    const categories: Category[] = result.items.map((item) => ({
      id: item.id,
      title: item.snippet.title,
      channelId: item.snippet.channelId,
    }))

    if (!categories.length) {
      return []
    }

    await this.cacheProvider.setCategoriesCache(categories)

    return categories
  }

  public async videoById(dto: YoutubeApiVideoById): Promise<Video> {
    const { videoId } = dto

    await this.filter.tryVideoId(videoId)

    const cachedVideo = await this.cacheProvider.getVideoCache(videoId)
    if (cachedVideo) {
      await this.filter.tryVideo(cachedVideo)
      return cachedVideo
    }

    let result: VideoFullResponse | null = null

    while (!result) {
      const apiKey = await this.youtubeApikeyService.getNextKey()

      try {
        const response = await this.request<VideoFullResponse>(apiKey, YTApiEndpoints.videoById, {
          part: 'snippet,contentDetails,statistics',
          id: videoId,
          hl: 'ru_RU',
        })

        if (response.data) {
          result = response.data
        }

        await this.updateQuota(apiKey, QuotaCosts.VIDEO_LIST)
      } catch (e) {
        await this.updateQuota(apiKey, QuotaCosts.VIDEO_LIST)

        if (this.isQuotaError(e)) {
          await this.setError(apiKey.id, e)
          continue
        }

        if (e?.response?.data?.error?.code === 403) {
          await this.setError(apiKey.id, e)
          break
        }

        if (e?.response?.data?.error?.code === 404) {
          throw new VideoNotFound()
        }

        throw new BadRequestException()
      }
    }

    if (result.items.length === 0) {
      throw new VideoNotFound()
    }

    const parserSettings = await this.settingsService.getParserSettings()

    const item = result.items[0]

    const video: Video = {
      id: item.id,
      title: item.snippet.title,
      description: parserSettings.saveVideoDescription ? item.snippet.description : '',
      snippet: '',
      channelId: item.snippet.channelId,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      duration: item.contentDetails.duration,
      durationSec: convertDurationToSeconds(item.contentDetails.duration),
      durationParts: getDurationParts(item.contentDetails.duration),
      readabilityDuration: convertTimeToFormat(item.contentDetails.duration),
      timeAgo: format(new Date(item.snippet.publishedAt), 'ru'),
      views: Number(item.statistics.viewCount),
      viewsStr: Number(item.statistics.viewCount).toLocaleString('ru'),
      titleLang: this.filter.detectCountryByText(item.snippet.title),
      channelTitleLang: LanguageCode.UNKNOWN,
    }

    await this.cacheProvider.setVideoCache(video)
    await this.filter.tryVideo(video)

    return video
  }

  public async videoByIds(dto: YoutubeApiVideoById): Promise<Video[]> {
    const ids = dto.videoId.split(',').map((id) => id.trim())
    if (!ids.length) {
      return []
    }

    const filteredIds = await this.filter.getWhiteVideoIds(ids)
    const cachedVideos = await this.cacheProvider.getVideosCache(filteredIds)

    const cachedVideoIds = cachedVideos.map(({ id }) => id)
    const nonCachedVideoIds = filteredIds.filter((id) => !cachedVideoIds.includes(id))
    if (!nonCachedVideoIds.length) {
      return await this.filter.getWhiteVideos(cachedVideos)
    }

    let result: VideoFullResponse | null = null

    while (!result) {
      const apiKey = await this.youtubeApikeyService.getNextKey()

      try {
        const response = await this.request<VideoFullResponse>(apiKey, YTApiEndpoints.videoById, {
          part: 'snippet,contentDetails,statistics',
          id: nonCachedVideoIds.join(','),
          hl: 'ru_RU',
        })

        if (response.data) {
          result = response.data
        }

        await this.updateQuota(apiKey, QuotaCosts.VIDEO_LIST)
      } catch (e) {
        await this.updateQuota(apiKey, QuotaCosts.VIDEO_LIST)

        if (this.isQuotaError(e)) {
          await this.setError(apiKey.id, e)
          continue
        }

        if (e?.response?.data?.error?.code === 403) {
          await this.setError(apiKey.id, e)
          break
        }

        if (e?.response?.data?.error?.code === 404) {
          throw new VideoNotFound()
        }

        throw new BadRequestException()
      }
    }

    if (result.items.length === 0) {
      throw new VideoNotFound()
    }

    const parserSettings = await this.settingsService.getParserSettings()

    const videos = result.items.map((item) => ({
      id: item.id,
      title: item.snippet.title,
      description: parserSettings.saveVideoDescription ? item.snippet.description : '',
      snippet: '',
      channelId: item.snippet.channelId,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      duration: item.contentDetails.duration,
      durationSec: convertDurationToSeconds(item.contentDetails.duration),
      durationParts: getDurationParts(item.contentDetails.duration),
      readabilityDuration: convertTimeToFormat(item.contentDetails.duration),
      timeAgo: format(new Date(item.snippet.publishedAt), 'ru'),
      views: Number(item.statistics.viewCount),
      viewsStr: Number(item.statistics.viewCount).toLocaleString('ru'),
      titleLang: this.filter.detectCountryByText(item.snippet.title),
      channelTitleLang: LanguageCode.UNKNOWN,
    }))

    await this.cacheProvider.setVideosCache(videos)

    return await this.filter.getWhiteVideos([...cachedVideos, ...videos])
  }

  public async videoByCategoryId(dto: YoutubeApiVideoByCategoryIdDto): Promise<Video[]> {
    const cachedVideo = await this.cacheProvider.getVideosByCategory(dto.categoryId)
    if (cachedVideo) {
      return await this.filter.getWhiteVideos(cachedVideo)
    }

    let result: VideoListResponse | null = null

    while (!result) {
      const apiKey = await this.youtubeApikeyService.getNextKey()

      try {
        const response = await this.request<VideoListResponse>(apiKey, YTApiEndpoints.videoByCategoryId, {
          part: 'snippet,contentDetails,statistics',
          chart: 'mostPopular',
          videoCategoryId: dto.categoryId,
          maxResults: 50,
          regionCode: 'RU',
          hl: 'ru_RU',
        })

        if (response.data) {
          result = response.data
        }

        await this.updateQuota(apiKey, QuotaCosts.VIDEO_LIST)
      } catch (e) {
        await this.updateQuota(apiKey, QuotaCosts.VIDEO_LIST)

        if (this.isQuotaError(e)) {
          await this.setError(apiKey.id, e)
          continue
        }

        if (e?.response?.data?.error?.code === 403) {
          await this.setError(apiKey.id, e)
          break
        }

        if (e?.response?.data?.error?.code === 404) {
          throw new VideoNotFound()
        }

        throw new BadRequestException()
      }
    }

    if (!result) {
      return []
    }

    const videoIds = result.items.map((item) => item.id)
    if (!videoIds.length) {
      return []
    }

    const videos = await this.videoByIds({ videoId: videoIds.join(',') })
    await this.cacheProvider.setVideosByCategory(dto.categoryId, videos)

    return videos
  }

  public async videoFull(dto: YoutubeApiVideoById): Promise<FullVideoData> {
    const { videoId } = dto
    const video = await this.videoById({ videoId })
    const comments = await this.comments({ videoId: video.id })
    const related = await this.videoByChannelId({ channelId: video.channelId })

    return { video, comments, related }
  }

  public async videoByChannelId(dto: YoutubeApiVideoByChannelIdDto): Promise<Video[]> {
    const { channelId } = dto

    await this.filter.tryChannel(channelId)

    const cachedVideo = await this.cacheProvider.getChannelsCache(channelId)
    if (cachedVideo) {
      return await this.filter.getWhiteVideos(cachedVideo)
    }

    let result: PlaylistItemListResponse | null = null

    while (!result) {
      const apiKey = await this.youtubeApikeyService.getNextKey()

      try {
        const channelResponse = await this.request<ChannelListResponse>(apiKey, YTApiEndpoints.channels, {
          part: 'contentDetails',
          id: channelId,
        })

        const uploadsPlaylist = channelResponse.data.items.find(
          (item) =>
            item?.contentDetails?.relatedPlaylists?.uploads !== undefined &&
            item?.contentDetails?.relatedPlaylists?.uploads.length !== 0
        )

        if (!uploadsPlaylist) {
          await this.updateQuota(apiKey, 1)
          throw new PlaylistNotFound()
        }

        const playlistResponse = await this.request<PlaylistItemListResponse>(apiKey, YTApiEndpoints.playlistItems, {
          part: 'snippet',
          maxResults: 50,
          playlistId: uploadsPlaylist.contentDetails.relatedPlaylists.uploads,
        })

        if (playlistResponse.data) {
          result = playlistResponse.data
        }

        await this.updateQuota(apiKey, 2)
      } catch (e) {
        await this.updateQuota(apiKey, 2)

        if (this.isQuotaError(e)) {
          await this.setError(apiKey.id, e)
          continue
        }

        if (e?.response?.data?.error?.code === 403) {
          await this.setError(apiKey.id, e)
          break
        }

        if (e?.response?.data?.error?.code === 404) {
          throw new VideoNotFound()
        }

        throw new BadRequestException()
      }
    }

    if (!result) {
      return []
    }

    const videoIds = result.items.map((item) => item.snippet.resourceId.videoId)
    const videos = await this.videoByIds({ videoId: videoIds.join(',') })
    if (videos.length <= videoIds.length / 2) {
      await this.cacheProvider.setVideosCache(
        videos.map((video) => ({ ...video, titleLang: LanguageCode.UK, channelTitleLang: LanguageCode.UK }))
      )
      await this.cacheProvider.setChannelsCache(channelId, [])
      return []
    }

    await this.cacheProvider.setChannelsCache(channelId, videos)

    return videos
  }

  public async videoByPlaylistId(dto: YoutubeApiVideoByPlaylistId): Promise<Video[]> {
    const { playlistId } = dto

    const cachedVideo = await this.cacheProvider.getPlaylistCache(playlistId)
    if (cachedVideo) {
      return await this.filter.getWhiteVideos(cachedVideo)
    }

    let result: PlaylistItemListResponse | null = null

    while (!result) {
      const apiKey = await this.youtubeApikeyService.getNextKey()

      try {
        const response = await this.request<PlaylistItemListResponse>(apiKey, YTApiEndpoints.playlistItems, {
          part: 'snippet,contentDetails,statistics',
          maxResults: 50,
          playlistId,
        })

        if (response.data) {
          result = response.data
        }

        await this.updateQuota(apiKey, QuotaCosts.PLAYLIST_ITEMS_LIST)
      } catch (e) {
        await this.updateQuota(apiKey, QuotaCosts.PLAYLIST_ITEMS_LIST)

        if (this.isQuotaError(e)) {
          await this.setError(apiKey.id, e)
          continue
        }

        if (e?.response?.data?.error?.code === 403) {
          await this.setError(apiKey.id, e)
          break
        }

        if (e?.response?.data?.error?.code === 404) {
          throw new VideoNotFound()
        }

        throw new BadRequestException()
      }
    }

    const videoIds = result.items.map((item) => item.snippet.resourceId.videoId)
    const videos = await this.videoByIds({ videoId: videoIds.join(',') })

    await this.cacheProvider.setPlaylistCache(playlistId, videos)

    return videos
  }

  public async comments(dto: YoutubeApiCommentsDto): Promise<Comment[]> {
    const { videoId } = dto

    const inBlackList = await this.filter.videoIdInBlacklist(videoId)
    if (inBlackList) {
      return []
    }

    const cachedComments = await this.cacheProvider.getCommentsCache(videoId)
    if (cachedComments) {
      return cachedComments
    }

    let result: CommentThreadListResponse | null = null

    while (!result) {
      const apiKey = await this.youtubeApikeyService.getNextKey()

      try {
        const response = await this.request<CommentThreadListResponse>(apiKey, YTApiEndpoints.commentThreads, {
          part: 'snippet',
          textFormat: 'plainText',
          videoId,
          maxResults: 100,
        })

        if (response.data) {
          result = response.data
        }

        await this.updateQuota(apiKey, QuotaCosts.COMMENTS_THREADS_LIST)
      } catch (e) {
        await this.updateQuota(apiKey, QuotaCosts.COMMENTS_THREADS_LIST)

        if (this.isQuotaError(e)) {
          await this.setError(apiKey.id, e)
          continue
        }

        if (e?.response?.data?.error?.code === 403) {
          await this.setError(apiKey.id, e)
          break
        }

        if (e?.response?.data?.error?.code === 404) {
          throw new NotFoundException()
        }

        throw new BadRequestException()
      }
    }

    if (!result) {
      return []
    }

    const comments: Comment[] = result.items.map((item) => {
      const comment = item.snippet.topLevelComment.snippet
      const { textDisplay, authorDisplayName, authorProfileImageUrl, publishedAt } = comment
      return {
        text: textDisplay,
        author: authorDisplayName,
        avatar: authorProfileImageUrl,
        publishedAt: publishedAt,
        timeAgo: format(new Date(publishedAt), 'ru'),
      }
    })

    await this.cacheProvider.setCommentsCache(videoId, comments)

    return comments.slice(0, 50)
  }

  public async trends(): Promise<Video[]> {
    const cachedVideo = await this.cacheProvider.getTrendsCache()
    if (cachedVideo) {
      return await this.filter.getWhiteVideos(cachedVideo)
    }

    let result: VideoListResponse | null = null

    while (!result) {
      const apiKey = await this.youtubeApikeyService.getNextKey()

      try {
        const response = await this.request<VideoListResponse>(apiKey, YTApiEndpoints.trends, {
          part: 'snippet,contentDetails,statistics',
          chart: 'mostPopular',
          maxResults: 50,
          regionCode: 'RU',
          hl: 'ru_RU',
        })

        if (response.data) {
          result = response.data
        }

        await this.updateQuota(apiKey, QuotaCosts.VIDEO_LIST)
      } catch (e) {
        await this.updateQuota(apiKey, QuotaCosts.VIDEO_LIST)

        if (this.isQuotaError(e)) {
          await this.setError(apiKey.id, e)
          continue
        }

        if (e?.response?.data?.error?.code === 403) {
          await this.setError(apiKey.id, e)
          break
        }

        if (e?.response?.data?.error?.code === 404) {
          throw new VideoNotFound()
        }

        throw new BadRequestException()
      }
    }

    const videoIds = result.items.map((item) => item.id)
    const videos = await this.videoByIds({ videoId: videoIds.join(',') })

    await this.cacheProvider.setTrendsCache(videos)

    return videos
  }

  public async categoriesWithVideos(): Promise<CategoryWithVideos[]> {
    const cachedData = await this.cacheProvider.getCategoriesWithVideosCache()
    if (cachedData) {
      return await Promise.all(
        cachedData.map(async ({ category, videos }) => ({
          category,
          videos: await this.filter.getWhiteVideos(videos),
        }))
      )
    }

    const categories = await this.categories()

    const data: CategoryWithVideos[] = await Promise.all(
      categories
        .filter((category) => AVAILABLE_CATEGORY_IDS.includes(Number(category.id)))
        .map(async (category) => {
          const videos = await this.videoByCategoryId({ categoryId: category.id })
          return { category, videos }
        })
    )

    if (!data.length) {
      return []
    }

    await this.cacheProvider.setCategoriesWithVideosCache(data)

    return data
  }

  private async setError(apiKeyId: number, e: any) {
    if (e?.response?.data?.error?.code === 403) {
      if (e?.response?.data?.error?.errors && Array.isArray(e?.response?.data?.error?.errors)) {
        const errors = e?.response?.data?.error?.errors as YTError[]
        const lastError = errors[0]
        if (lastError && lastError.reason !== 'commentsDisabled') {
          await this.youtubeApikeyService.setError(apiKeyId, lastError.reason)
        }
      }
    }
  }

  private isQuotaError(e: any): boolean {
    const errors = (e?.response?.data?.error?.errors ?? []) as YTError[]
    return errors.find((error) => error.reason === 'quotaExceeded') !== undefined
  }

  private async request<T>(apiKey: YoutubeApikey, url: string, params: object): Promise<AxiosResponse<T>> {
    const proxy = apiKey.proxies[0]

    const httpsAgent = new HttpsProxyAgent({
      proxy: `${proxy.protocol}://${proxy.login}:${proxy.password}@${proxy.ip}:${proxy.port}`,
    })

    const instance = axios.create({
      httpsAgent,
      params: { ...params, key: apiKey.apikey },
    })
    const response = await instance.get<T>(url)

    return response
  }

  private async updateQuota(apiKey: YoutubeApikey, cost: number) {
    await this.youtubeApikeyService.updateCurrentUsage(apiKey, cost)
    await this.quotaUsageService.addUsage({ currentUsage: cost })
  }
}
