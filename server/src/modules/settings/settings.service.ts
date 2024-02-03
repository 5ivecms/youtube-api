import { Inject, Injectable } from '@nestjs/common'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { InjectRepository } from '@nestjs/typeorm'
import { FindOptionsWhere, Repository } from 'typeorm'
import { Cache } from 'cache-manager'
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
import { ParserSettings, SettingsConfig, YoutubeCacheSettings } from '../../config/settings.config'

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(SettingsEntity) private readonly settingsRepository: Repository<SettingsEntity>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
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

  public async getInvidiousSettings(): Promise<InvidiousSettings> {
    const settingsCache = await this.cacheManager.get<InvidiousSettings | undefined>(SETTINGS_CACHE_KEY)
    if (settingsCache) {
      return settingsCache
    }

    const settings = await this.settingsRepository.findBy({ section: 'invidious' })

    const proxySettings = settings.find((setting) => setting.option === 'proxy')
    const timeoutSettings = settings.find((setting) => setting.option === 'timeout')
    const apiSettings = settings.find((setting) => setting.option === 'api')

    const settingsObj = {
      proxy: stringToBoolean(proxySettings.value),
      timeout: Number(timeoutSettings.value),
      api: stringToBoolean(apiSettings.value),
    }

    const { settingsCacheTtl } = this.configService.get<CacheConfig>('cache')

    await this.cacheManager.set(SETTINGS_CACHE_KEY, settingsObj, settingsCacheTtl)

    return settingsObj
  }

  public async getAppSettings(): Promise<AppSettings> {
    const settingsCache = await this.cacheManager.get<AppSettings | undefined>(APP_SETTINGS_CACHE_KEY)
    if (settingsCache) {
      return settingsCache
    }

    const settings = await this.settingsRepository.findBy({ section: 'app' })

    const enabledSettings = settings.find((setting) => setting.option === 'enabled')

    const settingsObj: AppSettings = {
      enabled: stringToBoolean(enabledSettings.value),
    }

    const { settingsCacheTtl } = this.configService.get<CacheConfig>('cache')

    await this.cacheManager.set(APP_SETTINGS_CACHE_KEY, settingsObj, settingsCacheTtl)

    return settingsObj
  }

  public async getApiKeysSettings(): Promise<ApiKeysSettings> {
    const settingsCache = await this.cacheManager.get<ApiKeysSettings | undefined>(API_KEY_SETTINGS_CACHE_KEY)
    if (settingsCache) {
      return settingsCache
    }
    const settings = await this.settingsRepository.findBy({ section: 'apiKeys' })

    const apiKeyPerProxyLimitSettings = settings.find((setting) => setting.option === 'apiKeyPerProxyLimit')

    const settingsObj: ApiKeysSettings = {
      apiKeyPerProxyLimit: Number(apiKeyPerProxyLimitSettings.value),
    }

    const { settingsCacheTtl } = this.configService.get<CacheConfig>('cache')

    await this.cacheManager.set(API_KEY_SETTINGS_CACHE_KEY, settingsObj, settingsCacheTtl)

    return settingsObj
  }

  public async getParserSettings(): Promise<ParserSettings> {
    const settingsCache = await this.cacheManager.get<ParserSettings | undefined>(PARSER_SETTINGS_KEY)
    if (settingsCache) {
      return settingsCache
    }
    const settings = await this.settingsRepository.findBy({ section: 'parser' })

    const saveVideoDescriptionSettings = settings.find((setting) => setting.option === 'saveVideoDescription')

    const settingsObj: ParserSettings = {
      saveVideoDescription: stringToBoolean(saveVideoDescriptionSettings.value),
    }

    const { settingsCacheTtl } = this.configService.get<CacheConfig>('cache')

    await this.cacheManager.set(PARSER_SETTINGS_KEY, settingsObj, settingsCacheTtl)

    return settingsObj
  }

  public async getYoutubeCacheSettings(): Promise<YoutubeCacheSettings> {
    const settingsCache = await this.cacheManager.get<YoutubeCacheSettings | undefined>(YOUTUBE_CACHE_SETTINGS_KEY)
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

    await this.cacheManager.set(YOUTUBE_CACHE_SETTINGS_KEY, settingsObj, 7 * settingsCacheTtl)

    return settingsObj
  }

  public async clearCache() {
    const keys: string[] = await this.cacheManager.store.keys()
    await Promise.all(
      keys.map(async (key) => {
        if (key.startsWith(SETTINGS_CACHE_KEY)) {
          await this.cacheManager.del(key)
        }
      })
    )
  }

  public async resetCache() {
    await this.cacheManager.reset()
  }

  public async cacheSize() {
    return await this.cacheManager.store.mget()
  }
}
