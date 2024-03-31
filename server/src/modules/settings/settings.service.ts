import { Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FindOptionsWhere, Repository } from 'typeorm'
import { DEFAULT_REDIS_NAMESPACE, InjectRedis } from '@liaoliaots/nestjs-redis'
import { Redis } from 'ioredis'
import { ConfigService } from '@nestjs/config'

import { SettingsEntity } from './settings.entity'
import { CreateSettingsDto, UpdateBulkSettings, UpdateSettingsDto } from './dto'
import { ApiKeysSettings, AppSettings, InvidiousSettings } from './settings.types'
import {
  API_KEY_SETTINGS_CACHE_KEY,
  APP_SETTINGS_CACHE_KEY,
  PARSER_SETTINGS_KEY,
  SETTINGS_CACHE_KEY,
  YOUTUBE_CACHE_SETTINGS_KEY,
} from './settings.constants'
import { CacheConfig } from '../../config/cache.config'
import { stringToBoolean } from '../../utils'
import { ParserSettings, YoutubeCacheSettings } from '../../config/settings.config'

@Injectable()
export class SettingsService {
  constructor(
    @InjectRedis(DEFAULT_REDIS_NAMESPACE) private readonly redis: Redis,
    @InjectRepository(SettingsEntity) private readonly settingsRepository: Repository<SettingsEntity>,
    private readonly configService: ConfigService
  ) {}

  public findAll() {
    return this.settingsRepository.find({ order: { id: 'ASC' } })
  }

  public findOne(where: FindOptionsWhere<SettingsEntity>) {
    return this.settingsRepository.findOneBy(where)
  }

  public async create(dto: CreateSettingsDto) {
    await this.clearCache()
    return this.settingsRepository.save(dto)
  }

  public async update(id: number, dto: UpdateSettingsDto) {
    await this.clearCache()
    return this.settingsRepository.update(id, dto)
  }

  public async updateBulk(dto: UpdateBulkSettings) {
    await this.clearCache()
    return Promise.all(
      dto.settings.map(async (setting) => {
        const { id, ...rest } = setting
        if (!id) {
          return
        }
        return await this.update(Number(id), rest)
      })
    )
  }

  public async delete(id: number) {
    await this.clearCache()
    return this.settingsRepository.delete(id)
  }

  public async getAppSettings(): Promise<AppSettings> {
    const settingsCache = await this.getRedisCache<AppSettings | undefined>(APP_SETTINGS_CACHE_KEY)
    if (settingsCache) {
      return settingsCache
    }

    const settings = await this.settingsRepository.findBy({ section: 'app' })

    const enabledSettings = settings.find((setting) => setting.option === 'enabled')

    const settingsObj: AppSettings = {
      enabled: stringToBoolean(enabledSettings.value),
    }

    const { settingsCacheTtl } = this.configService.get<CacheConfig>('cache')

    await this.setRedisCache(APP_SETTINGS_CACHE_KEY, settingsObj, settingsCacheTtl)

    return settingsObj
  }

  public async getApiKeysSettings(): Promise<ApiKeysSettings> {
    const settingsCache = await this.getRedisCache<ApiKeysSettings | undefined>(API_KEY_SETTINGS_CACHE_KEY)
    if (settingsCache) {
      return settingsCache
    }
    const settings = await this.settingsRepository.findBy({ section: 'apiKeys' })

    const apiKeyPerProxyLimitSettings = settings.find((setting) => setting.option === 'apiKeyPerProxyLimit')

    const settingsObj: ApiKeysSettings = {
      apiKeyPerProxyLimit: Number(apiKeyPerProxyLimitSettings.value),
    }

    const { settingsCacheTtl } = this.configService.get<CacheConfig>('cache')

    await this.setRedisCache(API_KEY_SETTINGS_CACHE_KEY, settingsObj, settingsCacheTtl)

    return settingsObj
  }

  public async getParserSettings(): Promise<ParserSettings> {
    const settingsCache = await this.getRedisCache<ParserSettings | undefined>(PARSER_SETTINGS_KEY)
    if (settingsCache) {
      return settingsCache
    }
    const settings = await this.settingsRepository.findBy({ section: 'parser' })

    const saveVideoDescriptionSettings = settings.find((setting) => setting.option === 'saveVideoDescription')

    const settingsObj: ParserSettings = {
      saveVideoDescription: stringToBoolean(saveVideoDescriptionSettings.value),
    }

    const { settingsCacheTtl } = this.configService.get<CacheConfig>('cache')

    await this.setRedisCache(PARSER_SETTINGS_KEY, settingsObj, settingsCacheTtl)

    return settingsObj
  }

  public async getYoutubeCacheSettings(): Promise<YoutubeCacheSettings> {
    const settingsCache = await this.getRedisCache<YoutubeCacheSettings | undefined>(YOUTUBE_CACHE_SETTINGS_KEY)
    if (settingsCache) {
      return settingsCache
    }
    const settings = await this.settingsRepository.findBy({ section: 'youtubeCache' })

    const searchCacheDays = settings.find((setting) => setting.option === 'search')
    const categoriesCacheDays = settings.find((setting) => setting.option === 'categories')
    const videoByIdCacheDays = settings.find((setting) => setting.option === 'videoById')
    const videoByCategoryIdCacheDays = settings.find((setting) => setting.option === 'videoByCategoryId')
    const videoByChannelIdCacheDays = settings.find((setting) => setting.option === 'videoByChannelId')
    const videoByPlaylistIdCacheDays = settings.find((setting) => setting.option === 'videoByPlaylistId')
    const videoCommentsCacheDays = settings.find((setting) => setting.option === 'videoComments')
    const trendsCacheDays = settings.find((setting) => setting.option === 'trends')
    const categoriesWithVideosCacheDays = settings.find((setting) => setting.option === 'categoriesWithVideos')

    const settingsObj: YoutubeCacheSettings = {
      search: Number(searchCacheDays.value),
      categories: Number(categoriesCacheDays.value),
      videoById: Number(videoByIdCacheDays.value),
      videoByCategoryId: Number(videoByCategoryIdCacheDays.value),
      videoByChannelId: Number(videoByChannelIdCacheDays.value),
      videoByPlaylistId: Number(videoByPlaylistIdCacheDays.value),
      videoComments: Number(videoCommentsCacheDays.value),
      trends: Number(trendsCacheDays.value),
      categoriesWithVideos: Number(categoriesWithVideosCacheDays.value),
    }

    const { settingsCacheTtl } = this.configService.get<CacheConfig>('cache')

    await this.setRedisCache(YOUTUBE_CACHE_SETTINGS_KEY, settingsObj, 7 * settingsCacheTtl)

    return settingsObj
  }

  public async clearCache() {
    const keys = await this.redis.keys(`${SETTINGS_CACHE_KEY}*`)
    if (keys.length) {
      await this.redis.del(...keys)
    }
  }

  public async resetCache() {
    await this.redis.flushdb()
  }

  public async cacheSize() {
    return await this.redis.dbsize()
  }

  private async getRedisCache<T>(key: string): Promise<T | null> {
    const data = await this.redis.get(key)
    if (data) {
      return JSON.parse(data) as T
    }

    return null
  }

  private async setRedisCache(key: string, data: any, ttl: number): Promise<void> {
    await this.redis.set(key, JSON.stringify(data), 'PX', ttl)
  }
}
