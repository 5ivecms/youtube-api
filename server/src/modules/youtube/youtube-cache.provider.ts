import { InjectRedis } from '@liaoliaots/nestjs-redis'
import { Injectable } from '@nestjs/common'
import { Redis } from 'ioredis'

import { SettingsService } from '../settings/settings.service'
import { Category, CategoryWithVideos, Comment, Video } from './youtube-api.types'
import { YoutubeCacheSettings } from '../../config/settings.config'
import { CacheKeys } from './utils'

@Injectable()
export class YoutubeCacheProvider {
  constructor(
    @InjectRedis('youtube-api') private readonly baseCache: Redis,
    @InjectRedis('youtube-api-channels') private readonly channelsCache: Redis,
    @InjectRedis('youtube-api-videos') private readonly videosCache: Redis,
    @InjectRedis('youtube-api-search') private readonly searchCache: Redis,
    @InjectRedis('youtube-api-comments') private readonly commentsCache: Redis,
    @InjectRedis('youtube-api-playlists') private readonly playlistsCache: Redis,
    private readonly settingsService: SettingsService
  ) {}

  public async getVideosCache(ids: string[]): Promise<Video[]> {
    const videos = (await Promise.all(ids.map(async (id) => await this.getVideoCache(id)))).filter(
      (video) => video !== null
    )
    return videos
  }

  public async setVideosCache(videos: Video[]): Promise<void> {
    await Promise.all(
      videos.map(async (video) => {
        await this.setVideoCache(video)
      })
    )
  }

  public async getVideoCache(key: string): Promise<Video | null> {
    const data = await this.videosCache.get(key)
    return data ? (JSON.parse(data) as Video) : null
  }

  public async setVideoCache(video: Video) {
    const settings = await this.settingsService.getYoutubeCacheSettings()
    await this.videosCache.set(video.id, JSON.stringify(video), 'EX', settings.videoById * 86_400)
  }

  public async getVideosByCategory(categoryId: string) {
    return await this.getBaseCache<Video[]>(CacheKeys.videoByCategoryId(categoryId))
  }

  public async setVideosByCategory(categoryId: string, videos: Video[]): Promise<void> {
    const settings = await this.settingsService.getYoutubeCacheSettings()
    await this.setBaseCache(CacheKeys.videoByCategoryId(categoryId), videos, settings.videoByCategoryId)
  }

  public async getCategoriesCache(): Promise<Category[] | null> {
    return await this.getBaseCache<Category[] | null>(CacheKeys.categories())
  }

  public async setCategoriesCache(data: any): Promise<void> {
    const settings = await this.settingsService.getYoutubeCacheSettings()
    await this.setBaseCache(CacheKeys.categories(), data, settings.categories)
  }

  public async setChannelsCache(key: string, data: any): Promise<void> {
    const settings = await this.settingsService.getYoutubeCacheSettings()
    await this.channelsCache.set(key, JSON.stringify(data), 'EX', settings.videoByChannelId * 86_400)
  }

  public async getChannelsCache(key: string): Promise<Video[] | null> {
    const data = await this.channelsCache.get(key)
    return data ? (JSON.parse(data) as Video[]) : null
  }

  public async setPlaylistCache(playlistId: string, videos: Video[]): Promise<void> {
    const settings = await this.settingsService.getYoutubeCacheSettings()
    await this.playlistsCache.set(
      CacheKeys.videoByPlaylistId(playlistId),
      JSON.stringify(videos),
      'EX',
      settings.videoByPlaylistId * 86_400
    )
  }

  public async getPlaylistCache(playlistId: string): Promise<Video[] | null> {
    const data = await this.playlistsCache.get(CacheKeys.videoByPlaylistId(playlistId))
    return data ? (JSON.parse(data) as Video[]) : null
  }

  public async setSearchCache(key: string, data: any): Promise<void> {
    const settings = await this.settingsService.getYoutubeCacheSettings()
    await this.searchCache.set(key, JSON.stringify(data), 'EX', settings.search * 86_400)
  }

  public async getSearchCache(key: string): Promise<Video[] | null> {
    const data = await this.searchCache.get(key)
    return data ? (JSON.parse(data) as Video[]) : null
  }

  public async setCommentsCache(videoId: string, comments: Comment[]): Promise<void> {
    const settings = await this.settingsService.getYoutubeCacheSettings()
    await this.commentsCache.set(
      CacheKeys.comments(videoId),
      JSON.stringify(comments),
      'EX',
      settings.videoComments * 86_400
    )
  }

  public async getCommentsCache(videoId: string): Promise<Comment[] | null> {
    const data = await this.commentsCache.get(CacheKeys.comments(videoId))
    return data ? (JSON.parse(data) as Comment[]) : null
  }

  public async setTrendsCache(videos: Video[]): Promise<void> {
    const settings = await this.settingsService.getYoutubeCacheSettings()
    await this.baseCache.set(CacheKeys.trends(), JSON.stringify(videos), 'EX', settings.trends * 86_400)
  }

  public async getTrendsCache(): Promise<Video[]> {
    return this.getBaseCache<Video[]>(CacheKeys.trends())
  }

  public async setCategoriesWithVideosCache(data: CategoryWithVideos[]): Promise<void> {
    const settings = await this.settingsService.getYoutubeCacheSettings()
    await this.baseCache.set(
      CacheKeys.categoriesWithVideos(),
      JSON.stringify(data),
      'EX',
      settings.categoriesWithVideos * 86_400
    )
  }

  public async getCategoriesWithVideosCache(): Promise<CategoryWithVideos[]> {
    return await this.getBaseCache<CategoryWithVideos[]>(CacheKeys.categoriesWithVideos())
  }

  private async getBaseCache<T>(key: string): Promise<T | null> {
    const data = await this.baseCache.get(key)
    return data ? (JSON.parse(data) as T) : null
  }

  private async setBaseCache(key: string, data: any, days: number): Promise<void> {
    await this.baseCache.set(key, JSON.stringify(data), 'EX', days * 86_400)
  }
}
