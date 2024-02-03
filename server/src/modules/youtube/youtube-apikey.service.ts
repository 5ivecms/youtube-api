import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, LessThan, Repository } from 'typeorm'

import { YoutubeApikey } from './youtube-apikey.entity'
import {
  CreateBulkYoutubeApikeyDto,
  CreateYoutubeApikeyDto,
  DeleteBulkYoutubeApikeysDto,
  UpdateYoutubeApikeyDto,
} from './dto'
import { SearchService } from '../../common/services/search-service/search.service'
import { MAX_QUOTA } from './constants'
import { QuotaUsageService } from '../quota-usage/quota-usage.service'
import { ProxyService } from '../proxy/proxy.service'
import { ProxyEntity } from '../proxy/proxy.entity'
import { SettingsService } from '../settings/settings.service'

@Injectable()
export class YoutubeApikeyService extends SearchService<YoutubeApikey> {
  constructor(
    @InjectRepository(YoutubeApikey) private readonly youtubeApikeyRepository: Repository<YoutubeApikey>,
    private readonly quotaUsageService: QuotaUsageService,
    private readonly proxyService: ProxyService,
    private dataSource: DataSource,
    private readonly settingsService: SettingsService
  ) {
    super(youtubeApikeyRepository)
  }

  public findAll() {
    return this.youtubeApikeyRepository.find()
  }

  public async quotaVolume() {
    const { sum } = await this.dataSource
      .getRepository(YoutubeApikey)
      .createQueryBuilder('ytApikey')
      .select('SUM(ytApikey.dailyLimit)', 'sum')
      .where('ytApikey.isActive = :isActive', { isActive: true })
      .getRawOne()
    return Number(sum)
  }

  public async statistic() {
    const total = await this.quotaVolume()
    const { currentUsage } = await this.quotaUsageService.todayUsage()
    return { total, today: currentUsage }
  }

  public async getNextKey() {
    const apiKey = await this.youtubeApikeyRepository.findOne({
      where: { currentUsage: LessThan(MAX_QUOTA), isActive: true },
      order: { currentUsage: 'ASC' },
      relations: { proxies: true },
    })

    if (!apiKey) {
      throw new NotFoundException('ApiKeys not found')
    }

    return apiKey
  }

  public async findOne(id: number) {
    const apikey = await this.youtubeApikeyRepository.findOneBy({ id })

    if (!apikey) {
      throw new NotFoundException('Apikey not found')
    }

    return apikey
  }

  public async create(dto: CreateYoutubeApikeyDto, proxies: ProxyEntity[] = []) {
    const entity = this.youtubeApikeyRepository.create(dto)
    entity.proxies = proxies
    return this.youtubeApikeyRepository.save(entity)
  }

  public async createBulk(dto: CreateBulkYoutubeApikeyDto) {
    type ProxyCountMapType = Record<string, { count: number; proxy: ProxyEntity }>

    const apiKeysSettings = await this.settingsService.getApiKeysSettings()

    const { apikeys, comment, dailyLimit } = dto

    const proxies = await this.proxyService.findAll()

    const proxyCountMap: ProxyCountMapType = {}
    proxies.forEach((proxy) => {
      proxyCountMap[`${proxy.ip}:${proxy.port}`] = { count: 0, proxy }
    })

    const apiKeyEntities = await this.youtubeApikeyRepository.find({ relations: { proxies: true } })
    apiKeyEntities.forEach((apiKey) => {
      apiKey.proxies.forEach((proxy) => {
        proxyCountMap[`${proxy.ip}:${[proxy.port]}`]['count'] += 1
      })
    })

    let canUseProxy: ProxyCountMapType = Object.entries(proxyCountMap).reduce(
      (acc, [ipPort, data]) => (data.count < apiKeysSettings.apiKeyPerProxyLimit ? { ...acc, [ipPort]: data } : acc),
      {}
    )

    const availableLimit = Object.values(canUseProxy).reduce(
      (acc, item) => acc + apiKeysSettings.apiKeyPerProxyLimit - item.count,
      0
    )
    if (availableLimit < apikeys.length) {
      throw new BadRequestException(
        `Недостаточно свободных прокси. Добавьте ${Math.ceil(
          (apikeys.length - availableLimit) / apiKeysSettings.apiKeyPerProxyLimit
        )} прокси`
      )
    }

    const proxyPerApiKey = apikeys.reduce((acc, item) => {
      const { proxy } = Object.values(canUseProxy).find((item) => item.count < apiKeysSettings.apiKeyPerProxyLimit)
      canUseProxy[`${proxy.ip}:${proxy.port}`]['count'] += 1
      return { ...acc, [item]: proxy }
    }, {})

    await Promise.all(
      apikeys.map(async (apikey) => {
        return await this.create({ apikey, comment, dailyLimit }, [proxyPerApiKey[apikey]])
      })
    )
  }

  public async update(id: number, dto: UpdateYoutubeApikeyDto) {
    return this.youtubeApikeyRepository.update(id, dto)
  }

  public async resetAllErrors() {
    return this.youtubeApikeyRepository.update({}, { error: '', isActive: true })
  }

  public async resetQuotaErrors() {
    const apiKeys = await this.youtubeApikeyRepository.find({ where: { error: 'quotaExceeded' } })
    return await Promise.all(
      apiKeys.map(async (apiKey) => {
        return await this.youtubeApikeyRepository.save({ ...apiKey, error: '', isActive: true })
      })
    )
  }

  public async delete(id: number) {
    return this.youtubeApikeyRepository.delete(id)
  }

  public async deleteBulk(dto: DeleteBulkYoutubeApikeysDto) {
    return this.youtubeApikeyRepository.delete(dto.ids)
  }

  public async clear() {
    return this.youtubeApikeyRepository.clear()
  }

  public setError(id: number, error: string) {
    return this.youtubeApikeyRepository.update(id, { isActive: false, error })
  }

  public async updateCurrentUsage(youtubeApiKey: YoutubeApikey, cost: number) {
    const entity = await this.findOne(youtubeApiKey.id)
    entity.currentUsage = entity.currentUsage + cost

    return this.youtubeApikeyRepository.save(entity)
  }

  public resetAllKeys() {
    return this.youtubeApikeyRepository.update({}, { currentUsage: 0 })
  }
}
