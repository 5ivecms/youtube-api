import { Inject, Injectable } from '@nestjs/common'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { InjectRepository } from '@nestjs/typeorm'
import { FindOptionsWhere, Repository } from 'typeorm'
import { Cache } from 'cache-manager'
import { ConfigService } from '@nestjs/config'

import { SettingsEntity } from './settings.entity'
import { CreateSettingsDto, UpdateBulkSettings, UpdateSettingsDto } from './dto'
import { InvidiousSettings } from './settings.types'
import { SETTINGS_CACHE_KEY } from './settings.constants'
import { CacheConfig } from '../../config/cache.config'

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
    const settingsObj = {
      proxy: Boolean(proxySettings.value),
      timeout: Number(timeoutSettings.value),
    }

    const { settingsCacheTtl } = this.configService.get<CacheConfig>('cache')
    await this.cacheManager.set(SETTINGS_CACHE_KEY, settingsObj, settingsCacheTtl)

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
}
