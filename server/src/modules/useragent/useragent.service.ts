import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { DEFAULT_REDIS_NAMESPACE, InjectRedis } from '@liaoliaots/nestjs-redis'
import { Redis } from 'ioredis'
import { ConfigService } from '@nestjs/config'

import { SearchService } from '../../common/services/search-service/search.service'
import { CreateBulkUseragentDto, CreateUseragentDto, DeleteBulkUseragentDto, UpdateUseragentDto } from './dto'
import { UseragentEntity } from './useragent.entity'
import { getRandomInt } from '../../utils'
import { USERAGENT_CACHE_KEY, getUseragentByIdCacheKey } from './useragent.constants'
import { CacheConfig } from '../../config/cache.config'

@Injectable()
export class UseragentService extends SearchService<UseragentEntity> {
  constructor(
    @InjectRedis(DEFAULT_REDIS_NAMESPACE) private readonly redis: Redis,
    @InjectRepository(UseragentEntity) private readonly useragentRepository: Repository<UseragentEntity>,
    private readonly configService: ConfigService
  ) {
    super(useragentRepository)
  }

  public async findAll() {
    const useragentsCache = await this.getRedisCache<UseragentEntity[]>(USERAGENT_CACHE_KEY)
    if (useragentsCache) {
      return useragentsCache
    }

    const { useragentsCacheTtl } = this.configService.get<CacheConfig>('cache')
    const useragents = await this.useragentRepository.find()
    await this.setRedisCache(USERAGENT_CACHE_KEY, useragents, useragentsCacheTtl)

    return useragents
  }

  public async findOne(id: number) {
    const useragentCache = await this.getRedisCache<UseragentEntity>(getUseragentByIdCacheKey(id))
    if (useragentCache) {
      return useragentCache
    }

    const entity = await this.useragentRepository.findOneBy({ id })

    if (!entity) {
      throw new NotFoundException('Useragent not found')
    }

    const { useragentsCacheTtl } = this.configService.get<CacheConfig>('cache')
    await this.setRedisCache(getUseragentByIdCacheKey(id), entity, useragentsCacheTtl)

    return entity
  }

  public async create(dto: CreateUseragentDto) {
    try {
      const { useragent } = dto
      const existEntity = await this.useragentRepository.findOne({ where: { useragent } })

      if (existEntity) {
        return existEntity
      }

      let index = 0
      let { index: maxIndex } = await this.getMaxIndex()
      if (maxIndex !== null) {
        index = maxIndex + 1
      }

      await this.clearCache()

      return await this.useragentRepository.save({ ...dto, index })
    } catch (e) {
      throw new InternalServerErrorException(e)
    }
  }

  public async createBulk(dto: CreateBulkUseragentDto) {
    const { useragents } = dto
    try {
      let index = 0
      let { index: maxIndex } = await this.getMaxIndex()
      if (maxIndex !== null) {
        index = maxIndex + 1
      }

      await this.clearCache()

      return await Promise.all(
        useragents.map(async (useragent, idx) => {
          return await this.useragentRepository.save({ useragent, index: index + idx })
        })
      )
    } catch (e) {
      throw new InternalServerErrorException(e)
    }
  }

  public async update(id: number, dto: UpdateUseragentDto) {
    const entity = await this.useragentRepository.findOne({ where: { id } })

    if (!entity) {
      throw new NotFoundException('Useragent not found')
    }

    await this.clearCache()

    return this.useragentRepository.update(id, dto)
  }

  public async delete(id: number) {
    const entity = await this.useragentRepository.findOne({ where: { id } })

    if (!entity) {
      throw new NotFoundException('Useragent not found')
    }

    const deleteResult = await this.useragentRepository.delete(id)
    await this.reIndex()
    await this.clearCache()

    return deleteResult
  }

  public async deleteBulk(dto: DeleteBulkUseragentDto) {
    const { ids } = dto
    try {
      const deleteResult = await this.useragentRepository.delete(ids)
      await this.reIndex()

      await this.clearCache()

      return deleteResult
    } catch (e) {
      throw new InternalServerErrorException(e)
    }
  }

  private async reIndex() {
    try {
      const hosts = await this.useragentRepository.find()

      await Promise.all([
        hosts.map(async (host, index) => {
          await this.useragentRepository.save({ ...host, index })
        }),
      ])
      await this.clearCache()
    } catch (e) {
      throw new InternalServerErrorException(e)
    }
  }

  public async getRandomUseragent(): Promise<UseragentEntity | null> {
    try {
      const { index: maxIndex } = await this.getMaxIndex()

      if (maxIndex === null) {
        return null
      }

      const index = getRandomInt(0, maxIndex)

      const useragentCache = await this.getRedisCache<UseragentEntity>(getUseragentByIdCacheKey(`index-${index}`))
      if (useragentCache) {
        return useragentCache
      }

      const { useragentsCacheTtl } = this.configService.get<CacheConfig>('cache')
      const useragent = await this.useragentRepository.findOne({ where: { index } })
      await this.setRedisCache(getUseragentByIdCacheKey(`index-${index}`), useragent, useragentsCacheTtl)

      return useragent
    } catch (e) {
      throw new InternalServerErrorException(e)
    }
  }

  private async getMaxIndex() {
    const query = this.useragentRepository.createQueryBuilder('useragent')
    query.select('MAX(useragent.index)', 'index')
    return await query.getRawOne()
  }

  public async clear() {
    await this.clearCache()
    return this.useragentRepository.clear()
  }

  public async clearCache() {
    const keys = await this.redis.keys(`${USERAGENT_CACHE_KEY}*`)
    if (keys.length) {
      await this.redis.del(...keys)
    }
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
