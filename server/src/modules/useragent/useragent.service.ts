import { Injectable, Inject, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'
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
    @InjectRepository(UseragentEntity) private readonly useragentRepository: Repository<UseragentEntity>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly configService: ConfigService
  ) {
    super(useragentRepository)
  }

  public async findAll() {
    const useragentsCache = await this.cacheManager.get<UseragentEntity[]>(USERAGENT_CACHE_KEY)
    if (useragentsCache) {
      return useragentsCache
    }

    const { useragentsCacheTtl } = this.configService.get<CacheConfig>('cache')
    const useragents = await this.useragentRepository.find()
    await this.cacheManager.set(USERAGENT_CACHE_KEY, useragents, useragentsCacheTtl)

    return useragents
  }

  public async findOne(id: number) {
    const useragentCache = await this.cacheManager.get<UseragentEntity>(getUseragentByIdCacheKey(id))
    if (useragentCache) {
      return useragentCache
    }

    const entity = await this.useragentRepository.findOneBy({ id })

    if (!entity) {
      throw new NotFoundException('Useragent not found')
    }

    const { useragentsCacheTtl } = this.configService.get<CacheConfig>('cache')
    await this.cacheManager.set(getUseragentByIdCacheKey(id), entity, useragentsCacheTtl)

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

      const useragentCache = await this.cacheManager.get<UseragentEntity>(getUseragentByIdCacheKey(`index-${index}`))
      if (useragentCache) {
        return useragentCache
      }

      const { useragentsCacheTtl } = this.configService.get<CacheConfig>('cache')
      const useragent = await this.useragentRepository.findOne({ where: { index } })
      await this.cacheManager.set(getUseragentByIdCacheKey(`index-${index}`), useragent, useragentsCacheTtl)

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
    const keys: string[] = await this.cacheManager.store.keys()
    await Promise.all(
      keys.map(async (key) => {
        if (key.startsWith(USERAGENT_CACHE_KEY)) {
          await this.cacheManager.del(key)
        }
      })
    )
  }
}
