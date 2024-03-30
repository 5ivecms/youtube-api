import { Injectable, Inject, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DeleteResult, FindOptionsWhere, Repository } from 'typeorm'
import { randomBytes } from 'crypto'
import { ConfigService } from '@nestjs/config'
import { DEFAULT_REDIS_NAMESPACE, InjectRedis } from '@liaoliaots/nestjs-redis'
import { Redis } from 'ioredis'

import { ApiKeyEntity } from './api-key.entity'
import { SearchService } from '../../common/services/search-service/search.service'
import { CreateApiKeyDto, DeleteBulkApiKeysDto, UpdateApiKeyDto } from './dto'
import { API_KEY_CACHE_KEY, getApiKeyСompositeCacheKey } from './api-key.constants'
import { CacheConfig } from '../../config/cache.config'

@Injectable()
export class ApiKeyService extends SearchService<ApiKeyEntity> {
  constructor(
    @InjectRedis(DEFAULT_REDIS_NAMESPACE) private readonly redis: Redis,
    @InjectRepository(ApiKeyEntity) private readonly apiKeyRepository: Repository<ApiKeyEntity>,
    private readonly configService: ConfigService
  ) {
    super(apiKeyRepository)
  }

  public async findAll(): Promise<ApiKeyEntity[]> {
    const apiKeysCache = await this.getRedisCache<ApiKeyEntity[]>(API_KEY_CACHE_KEY)
    if (apiKeysCache) {
      return apiKeysCache
    }

    const { apiKeyCacheTtl } = this.configService.get<CacheConfig>('cache')
    const apiKeys = await this.apiKeyRepository.find()
    await this.setRedisCache(API_KEY_CACHE_KEY, apiKeys, apiKeyCacheTtl)

    return apiKeys
  }

  public async findOne(id: number): Promise<ApiKeyEntity> {
    const apiKeyCache = await this.getRedisCache<ApiKeyEntity>(getApiKeyСompositeCacheKey(id))
    if (apiKeyCache) {
      return apiKeyCache
    }

    const apiKey = await this.apiKeyRepository.findOneBy({ id })

    if (!apiKey) {
      throw new NotFoundException('ApiKey not Found')
    }

    const { apiKeyCacheTtl } = this.configService.get<CacheConfig>('cache')
    await this.setRedisCache(getApiKeyСompositeCacheKey(id), apiKey, apiKeyCacheTtl)

    return apiKey
  }

  public async findOneByApiKey(apiKey: string): Promise<ApiKeyEntity> {
    const apiKeyCache = await this.getRedisCache<ApiKeyEntity>(getApiKeyСompositeCacheKey(`api-key-${apiKey}`))
    if (apiKeyCache) {
      return apiKeyCache
    }

    const apiKeyEntity = await this.apiKeyRepository.findOneBy({ apiKey })

    if (!apiKeyEntity) {
      throw new NotFoundException('ApiKey not Found')
    }

    const { apiKeyCacheTtl } = this.configService.get<CacheConfig>('cache')
    await this.setRedisCache(getApiKeyСompositeCacheKey(`api-key-${apiKey}`), apiKeyEntity, apiKeyCacheTtl)

    return apiKeyEntity
  }

  public async findOneBy(where: FindOptionsWhere<ApiKeyEntity> = {}): Promise<ApiKeyEntity> {
    const apiKey = await this.apiKeyRepository.findOneBy(where)

    if (!apiKey) {
      throw new NotFoundException('ApiKey not Found')
    }

    return apiKey
  }

  public async create(dto: CreateApiKeyDto): Promise<ApiKeyEntity> {
    const { apiKey } = this.generateApiKey()
    await this.clearCache()
    return this.apiKeyRepository.save({ apiKey, ...dto })
  }

  public async update(id: number, dto: UpdateApiKeyDto) {
    const entity = await this.apiKeyRepository.findOne({ where: { id } })

    if (!entity) {
      throw new NotFoundException('Api key not found')
    }

    await this.clearCache()

    return this.apiKeyRepository.update(id, dto)
  }

  public async deleteBulk(dto: DeleteBulkApiKeysDto) {
    const { ids } = dto
    await this.clearCache()
    return await this.apiKeyRepository.delete(ids)
  }

  public async delete(id: number): Promise<DeleteResult> {
    await this.clearCache()
    return this.apiKeyRepository.delete(id)
  }

  public generateApiKey(): { apiKey: string } {
    return { apiKey: randomBytes(20).toString('hex') }
  }

  public async clearCache() {
    const apiKeys = await this.apiKeyRepository.find()
    const keys = apiKeys.map(({ id }) => getApiKeyСompositeCacheKey(id))
    await this.redis.del(API_KEY_CACHE_KEY, ...keys)
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
