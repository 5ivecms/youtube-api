import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common'
import axios, { AxiosResponse } from 'axios'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'
import { format, register } from 'timeago.js'
import ruLocale from 'timeago.js/lib/lang/ru'

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
import { CacheKeys } from './utils'
import { convertDurationToSeconds, convertTimeToFormat, getDurationParts } from '../../utils'
import { VideoBlacklistService } from '../video-blacklist/video-blacklist.service'
import { SafeWordService } from '../safe-word/safe-word.service'
import { QuotaUsageService } from '../quota-usage/quota-usage.service'
import { HttpsProxyAgent } from 'hpagent'
import { YoutubeApikey } from './youtube-apikey.entity'
import { SettingsService } from '../settings/settings.service'

register('ru', ruLocale)

// Видео без комментариев iWcBrz0YWyE

@Injectable()
export class YoutubeApiService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheService: Cache,
    private readonly youtubeApikeyService: YoutubeApikeyService,
    private readonly videoBlacklistService: VideoBlacklistService,
    private readonly safeWordsService: SafeWordService,
    private readonly quotaUsageService: QuotaUsageService,
    private readonly settingsService: SettingsService
  ) {}

  public async search(dto: YoutubeApiSearchDto): Promise<Video[]> {
    await this.checkAppOnline()

    const settings = await this.settingsService.getYoutubeCacheSettings()

    const safeWords = await this.safeWordsService.getAllSafeWords()
    if (safeWords.includes(dto.q)) {
      return []
    }

    const cachedVideo = await this.cacheService.get<Video[]>(CacheKeys.search(dto.q))
    if (cachedVideo) {
      return cachedVideo
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
          relevanceLanguage: 'ru',
          safeSearch: 'strict',
          videoEmbeddable: true,
          videoSyndicated: true,
        })

        if (response.data) {
          result = response.data
        }
      } catch (e) {
        if (this.isQuotaError(e)) {
          await this.setError(apiKey.id, e)
          continue
        }

        if (e?.response?.data?.error?.code === 403) {
          await this.setError(apiKey.id, e)
          continue
        }

        if (e?.response?.data?.error?.code === 404) {
          throw new NotFoundException()
        }

        throw new BadRequestException()
      } finally {
        await this.youtubeApikeyService.updateCurrentUsage(apiKey, QuotaCosts.SEARCH_LIST)
        await this.quotaUsageService.addUsage({ currentUsage: QuotaCosts.SEARCH_LIST })
      }
    }

    const blackList = (await this.videoBlacklistService.findAll()).map(({ videoId }) => videoId)

    const videoIds: string[] = result.items
      .filter((item) => !blackList.includes(item.id.videoId))
      .map((item) => item.id.videoId)

    if (!videoIds.length) {
      return []
    }

    const videos = await this.videoByIds({ videoId: videoIds.join(',') })

    await this.cacheService.set(CacheKeys.search(dto.q), videos, settings.search * 86400000)

    return videos
  }

  public async categories(): Promise<Category[]> {
    const settings = await this.settingsService.getYoutubeCacheSettings()
    await this.checkAppOnline()

    const cachedVideo = await this.cacheService.get<Category[]>(CacheKeys.categories())
    if (cachedVideo) {
      return cachedVideo
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
      } catch (e) {
        if (this.isQuotaError(e)) {
          await this.setError(apiKey.id, e)
          continue
        }

        if (e?.response?.data?.error?.code === 403) {
          await this.setError(apiKey.id, e)
          continue
        }

        if (e?.response?.data?.error?.code === 404) {
          throw new NotFoundException()
        }

        throw new BadRequestException()
      } finally {
        await this.youtubeApikeyService.updateCurrentUsage(apiKey, QuotaCosts.VIDEO_CATEGORIES_LIST)
        await this.quotaUsageService.addUsage({ currentUsage: QuotaCosts.VIDEO_CATEGORIES_LIST })
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

    await this.cacheService.set(CacheKeys.categories(), categories, settings.categories * 86400000)

    return categories
  }

  public async videoById(dto: YoutubeApiVideoById): Promise<Video> {
    const appSettings = await this.settingsService.getAppSettings()
    if (!appSettings.enabled) {
      throw new BadRequestException('App offline')
    }

    const { videoId } = dto
    const inBlackList = await this.videoBlacklistService.inBlacklist(videoId)
    if (inBlackList) {
      throw new NotFoundException()
    }

    const cachedVideo = await this.cacheService.get<Video>(CacheKeys.videoById(videoId))
    if (cachedVideo) {
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
      } catch (e) {
        if (this.isQuotaError(e)) {
          await this.setError(apiKey.id, e)
          continue
        }

        if (e?.response?.data?.error?.code === 403) {
          await this.setError(apiKey.id, e)
          continue
        }

        if (e?.response?.data?.error?.code === 404) {
          throw new NotFoundException()
        }

        throw new BadRequestException()
      } finally {
        await this.youtubeApikeyService.updateCurrentUsage(apiKey, QuotaCosts.VIDEO_LIST)
        await this.quotaUsageService.addUsage({ currentUsage: QuotaCosts.VIDEO_LIST })
      }
    }

    if (result.items.length === 0) {
      throw new NotFoundException('Video not found')
    }

    const parserSettings = await this.settingsService.getParserSettings()

    const item = result.items[0]

    const video: Video = {
      id: item.id,
      title: item.snippet.title,
      description: parserSettings.saveVideoDescription ? item.snippet.description : '',
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
    }

    await this.setCacheVideoById(video)

    return video
  }

  public async videoByIds(dto: YoutubeApiVideoById): Promise<Video[]> {
    await this.checkAppOnline()

    const ids = dto.videoId.split(',').map((id) => id.trim())

    const cachedVideos = (
      await Promise.all(
        ids.map(async (id) => {
          return await this.cacheService.get<Video>(CacheKeys.videoById(id))
        })
      )
    ).filter((video) => video !== undefined)

    const cachedVideoIds = cachedVideos.map((video) => video.id)
    const nonCachedVideoIds = ids.filter((id) => !cachedVideoIds.includes(id))

    if (!nonCachedVideoIds.length) {
      return cachedVideos
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
      } catch (e) {
        if (this.isQuotaError(e)) {
          await this.setError(apiKey.id, e)
          continue
        }

        if (e?.response?.data?.error?.code === 403) {
          await this.setError(apiKey.id, e)
          continue
        }

        if (e?.response?.data?.error?.code === 404) {
          throw new NotFoundException()
        }

        throw new BadRequestException()
      } finally {
        await this.youtubeApikeyService.updateCurrentUsage(apiKey, QuotaCosts.VIDEO_LIST)
        await this.quotaUsageService.addUsage({ currentUsage: QuotaCosts.VIDEO_LIST })
      }
    }

    if (result.items.length === 0) {
      throw new NotFoundException('Video not found')
    }

    const parserSettings = await this.settingsService.getParserSettings()

    const videos: Video[] = result.items.map((item) => {
      return {
        id: item.id,
        title: item.snippet.title,
        description: parserSettings.saveVideoDescription ? item.snippet.description : '',
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
      }
    })

    await Promise.all(
      videos.map(async (video) => {
        await this.setCacheVideoById(video)
      })
    )

    return [...cachedVideos, ...videos]
  }

  public async videoByCategoryId(dto: YoutubeApiVideoByCategoryIdDto): Promise<Video[]> {
    await this.checkAppOnline()

    const settings = await this.settingsService.getYoutubeCacheSettings()

    const cachedVideo = await this.cacheService.get<Video[]>(CacheKeys.videoByCategoryId(dto.categoryId))
    if (cachedVideo) {
      return cachedVideo
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
      } catch (e) {
        if (this.isQuotaError(e)) {
          await this.setError(apiKey.id, e)
          continue
        }

        if (e?.response?.data?.error?.code === 403) {
          await this.setError(apiKey.id, e)
          continue
        }

        if (e?.response?.data?.error?.code === 404) {
          throw new NotFoundException()
        }

        throw new BadRequestException()
      } finally {
        await this.youtubeApikeyService.updateCurrentUsage(apiKey, QuotaCosts.VIDEO_LIST)
        await this.quotaUsageService.addUsage({ currentUsage: QuotaCosts.VIDEO_LIST })
      }
    }

    const blackList = (await this.videoBlacklistService.findAll()).map(({ videoId }) => videoId)
    const videoIds: string[] = result.items.filter((item) => !blackList.includes(item.id)).map((item) => item.id)

    if (!videoIds.length) {
      return []
    }

    const videos = await this.videoByIds({ videoId: videoIds.join(',') })

    await this.cacheService.set(
      CacheKeys.videoByCategoryId(dto.categoryId),
      videos,
      settings.videoByCategoryId * 86400000
    )

    return videos
  }

  public async videoFull(dto: YoutubeApiVideoById): Promise<FullVideoData> {
    await this.checkAppOnline()

    const { videoId } = dto

    const video: Video = await this.videoById({ videoId })
    const comments: Comment[] = await this.comments({ videoId: video.id })
    const related: Video[] = await this.videoByChannelId({ channelId: video.channelId })

    return { video, comments, related }
  }

  public async videoByChannelId(dto: YoutubeApiVideoByChannelIdDto): Promise<Video[]> {
    await this.checkAppOnline()

    const settings = await this.settingsService.getYoutubeCacheSettings()

    const cachedVideo = await this.cacheService.get<Video[]>(CacheKeys.videoByChannelId(dto.channelId))
    if (cachedVideo) {
      return cachedVideo
    }

    let result: PlaylistItemListResponse | null = null

    while (!result) {
      const apiKey = await this.youtubeApikeyService.getNextKey()

      try {
        const channelResponse = await this.request<ChannelListResponse>(apiKey, YTApiEndpoints.channels, {
          part: 'contentDetails',
          id: dto.channelId,
        })

        const uploadsPlaylist = channelResponse.data.items.find(
          (item) =>
            item?.contentDetails?.relatedPlaylists?.uploads !== undefined &&
            item?.contentDetails?.relatedPlaylists?.uploads.length !== 0
        )

        if (!uploadsPlaylist) {
          await this.youtubeApikeyService.updateCurrentUsage(apiKey, 2)
          await this.quotaUsageService.addUsage({ currentUsage: 2 })

          throw new NotFoundException('Uploads playlist not found')
        }

        const playlistResponse = await this.request<PlaylistItemListResponse>(apiKey, YTApiEndpoints.playlistItems, {
          part: 'snippet',
          maxResults: 50,
          playlistId: uploadsPlaylist.contentDetails.relatedPlaylists.uploads,
        })

        if (playlistResponse.data) {
          result = playlistResponse.data
        }
      } catch (e) {
        if (this.isQuotaError(e)) {
          await this.setError(apiKey.id, e)
          continue
        }

        if (e?.response?.data?.error?.code === 403) {
          await this.setError(apiKey.id, e)
          continue
        }

        if (e?.response?.data?.error?.code === 404) {
          throw new NotFoundException()
        }

        throw new BadRequestException()
      } finally {
        await this.youtubeApikeyService.updateCurrentUsage(apiKey, 2)
        await this.quotaUsageService.addUsage({ currentUsage: 2 })
      }
    }

    if (!result) {
      return []
    }

    const blackList = (await this.videoBlacklistService.findAll()).map(({ videoId }) => videoId)

    const videoIds: string[] = result.items
      .filter((item) => !blackList.includes(item.snippet.resourceId.videoId))
      .map((item) => item.snippet.resourceId.videoId)

    if (!videoIds.length) {
      return []
    }

    const videos = await this.videoByIds({ videoId: videoIds.join(',') })

    await this.cacheService.set(CacheKeys.videoByChannelId(dto.channelId), videos, settings.videoByChannelId * 86400000)

    return videos.slice(0, 20)
  }

  public async videoByPlaylistId(dto: YoutubeApiVideoByPlaylistId): Promise<Video[]> {
    await this.checkAppOnline()

    const settings = await this.settingsService.getYoutubeCacheSettings()

    const cachedVideo = await this.cacheService.get<Video[]>(CacheKeys.videoByPlaylistId(dto.playlistId))
    if (cachedVideo) {
      return cachedVideo
    }

    let result: PlaylistItemListResponse | null = null

    while (!result) {
      const apiKey = await this.youtubeApikeyService.getNextKey()

      try {
        const response = await this.request<PlaylistItemListResponse>(apiKey, YTApiEndpoints.playlistItems, {
          part: 'snippet,contentDetails,statistics',
          maxResults: 50,
          playlistId: dto.playlistId,
        })
        if (response.data) {
          result = response.data
        }
      } catch (e) {
        if (this.isQuotaError(e)) {
          await this.setError(apiKey.id, e)
          continue
        }

        if (e?.response?.data?.error?.code === 403) {
          await this.setError(apiKey.id, e)
          continue
        }

        if (e?.response?.data?.error?.code === 404) {
          throw new NotFoundException()
        }

        throw new BadRequestException()
      } finally {
        await this.youtubeApikeyService.updateCurrentUsage(apiKey, QuotaCosts.PLAYLIST_ITEMS_LIST)
        await this.quotaUsageService.addUsage({ currentUsage: QuotaCosts.PLAYLIST_ITEMS_LIST })
      }
    }

    const blackList = (await this.videoBlacklistService.findAll()).map(({ videoId }) => videoId)

    const videoIds: string[] = result.items
      .filter((item) => !blackList.includes(item.snippet.resourceId.videoId))
      .map((item) => item.snippet.resourceId.videoId)

    if (!videoIds.length) {
      return []
    }

    const videos = await this.videoByIds({ videoId: videoIds.join(',') })

    await this.cacheService.set(
      CacheKeys.videoByPlaylistId(dto.playlistId),
      videos,
      settings.videoByPlaylistId * 86400000
    )

    return videos
  }

  public async comments(dto: YoutubeApiCommentsDto): Promise<Comment[]> {
    await this.checkAppOnline()

    const settings = await this.settingsService.getYoutubeCacheSettings()

    const cachedVideo = await this.cacheService.get<Comment[]>(CacheKeys.comments(dto.videoId))
    if (cachedVideo) {
      return cachedVideo
    }

    let result: CommentThreadListResponse | null = null

    while (!result) {
      const apiKey = await this.youtubeApikeyService.getNextKey()

      try {
        const response = await this.request<CommentThreadListResponse>(apiKey, YTApiEndpoints.commentThreads, {
          part: 'snippet',
          textFormat: 'plainText',
          videoId: dto.videoId,
          maxResults: 100,
        })

        if (response.data) {
          result = response.data
        }
      } catch (e) {
        if (this.isQuotaError(e)) {
          await this.setError(apiKey.id, e)
          continue
        }

        if (e?.response?.data?.error?.code === 403) {
          await this.setError(apiKey.id, e)
          continue
        }

        if (e?.response?.data?.error?.code === 404) {
          throw new NotFoundException()
        }

        throw new BadRequestException()
      } finally {
        await this.youtubeApikeyService.updateCurrentUsage(apiKey, QuotaCosts.COMMENTS_THREADS_LIST)
        await this.quotaUsageService.addUsage({ currentUsage: QuotaCosts.COMMENTS_THREADS_LIST })
      }
    }

    if (!result) {
      return []
    }

    const comments: Comment[] = result.items.map((item) => ({
      text: item.snippet.topLevelComment.snippet.textDisplay,
      author: item.snippet.topLevelComment.snippet.authorDisplayName,
      avatar: item.snippet.topLevelComment.snippet.authorProfileImageUrl,
      publishedAt: item.snippet.topLevelComment.snippet.publishedAt,
      timeAgo: format(new Date(item.snippet.topLevelComment.snippet.publishedAt), 'ru'),
    }))

    await this.cacheService.set(CacheKeys.comments(dto.videoId), comments, settings.videoComments * 86400000)

    return comments.slice(0, 50)
  }

  public async trends(): Promise<Video[]> {
    await this.checkAppOnline()

    const settings = await this.settingsService.getYoutubeCacheSettings()

    const cachedVideo = await this.cacheService.get<Video[]>(CacheKeys.trends())
    if (cachedVideo) {
      return cachedVideo
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
      } catch (e) {
        if (this.isQuotaError(e)) {
          await this.setError(apiKey.id, e)
          continue
        }

        if (e?.response?.data?.error?.code === 403) {
          await this.setError(apiKey.id, e)
          continue
        }

        if (e?.response?.data?.error?.code === 404) {
          throw new NotFoundException()
        }

        throw new BadRequestException()
      } finally {
        await this.youtubeApikeyService.updateCurrentUsage(apiKey, QuotaCosts.VIDEO_LIST)
        await this.quotaUsageService.addUsage({ currentUsage: QuotaCosts.VIDEO_LIST })
      }
    }

    const blackList = (await this.videoBlacklistService.findAll()).map(({ videoId }) => videoId)

    const videoIds: string[] = result.items.filter((item) => !blackList.includes(item.id)).map((item) => item.id)
    if (!videoIds.length) {
      return []
    }

    const videos = await this.videoByIds({ videoId: videoIds.join(',') })

    await this.cacheService.set(CacheKeys.trends(), videos, settings.trends * 86400000)

    return videos
  }

  public async categoriesWithVideos() {
    await this.checkAppOnline()

    const settings = await this.settingsService.getYoutubeCacheSettings()

    const cachedData = await this.cacheService.get<CategoryWithVideos[]>(CacheKeys.categoriesWithVideos())
    if (cachedData) {
      return cachedData
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

    await this.cacheService.set(CacheKeys.categoriesWithVideos(), data, settings.categoriesWithVideos * 86400000)

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

  private async checkAppOnline() {
    const appSettings = await this.settingsService.getAppSettings()
    if (!appSettings.enabled) {
      throw new BadRequestException('App offline')
    }
  }

  private async setCacheVideoById(video: Video) {
    const settings = await this.settingsService.getYoutubeCacheSettings()
    await this.cacheService.set(CacheKeys.videoById(video.id), video, settings.videoById * 86400000)
  }
}
