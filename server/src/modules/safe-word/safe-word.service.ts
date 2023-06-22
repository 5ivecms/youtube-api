import { Injectable, Inject, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'
import { ConfigService } from '@nestjs/config'

import { SafeWordEntity } from './safe-word.entity'
import { CreateBulkSafeWordDto, CreateSafeWordDto, DeleteBulkSafeWordDto, UpdateSafeWordDto } from './dto'
import { SearchService } from '../../common/services/search-service/search.service'
import { SAFE_WORD_CACHE_KEY, getSafeWordСompositeCacheKey } from './safe-word.constants'
import { CacheConfig } from '../../config/cache.config'

@Injectable()
export class SafeWordService extends SearchService<SafeWordEntity> {
  constructor(
    @InjectRepository(SafeWordEntity) private readonly safeWordRepository: Repository<SafeWordEntity>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly configService: ConfigService
  ) {
    super(safeWordRepository)
  }

  public async findAll(): Promise<SafeWordEntity[]> {
    const safeWordsCache = await this.cacheManager.get<SafeWordEntity[]>(SAFE_WORD_CACHE_KEY)
    if (safeWordsCache) {
      return safeWordsCache
    }

    const { safeWordsCacheTtl } = this.configService.get<CacheConfig>('cache')
    const safeWords = await this.safeWordRepository.find()
    await this.cacheManager.set(SAFE_WORD_CACHE_KEY, safeWords, safeWordsCacheTtl)

    return safeWords
  }

  public async findOne(id: number) {
    const safeWordCache = await this.cacheManager.get<SafeWordEntity>(getSafeWordСompositeCacheKey(id))
    if (safeWordCache) {
      return safeWordCache
    }

    const entity = this.safeWordRepository.findOneBy({ id })

    if (!entity) {
      throw new NotFoundException('Safe word not found')
    }

    const { safeWordsCacheTtl } = this.configService.get<CacheConfig>('cache')
    await this.cacheManager.set(getSafeWordСompositeCacheKey(id), entity, safeWordsCacheTtl)

    return entity
  }

  public async create(dto: CreateSafeWordDto): Promise<SafeWordEntity> {
    try {
      const { phrase } = dto
      const safeWord = await this.safeWordRepository.findOne({ where: { phrase } })

      if (safeWord) {
        return safeWord
      }

      await this.clearCache()

      return await this.safeWordRepository.save(dto)
    } catch (e) {
      throw new InternalServerErrorException(e)
    }
  }

  public async createBulk(dto: CreateBulkSafeWordDto): Promise<SafeWordEntity[]> {
    await this.clearCache()
    return await Promise.all(dto.phrases.map(async (phrase) => await this.safeWordRepository.save({ phrase })))
  }

  public async update(id: number, dto: UpdateSafeWordDto) {
    await this.findOne(id)
    await this.clearCache()
    return this.safeWordRepository.update(id, { phrase: dto.phrase.trim() })
  }

  public async delete(id: number) {
    await this.clearCache()
    return this.safeWordRepository.delete(id)
  }

  public async deleteBulk(dto: DeleteBulkSafeWordDto) {
    await this.clearCache()
    return this.safeWordRepository.delete(dto.ids)
  }

  public async clear() {
    await this.clearCache()
    return this.safeWordRepository.clear()
  }

  public async clearCache() {
    const keys: string[] = await this.cacheManager.store.keys()
    await Promise.all(
      keys.map(async (key) => {
        if (key.startsWith(SAFE_WORD_CACHE_KEY)) {
          await this.cacheManager.del(key)
        }
      })
    )
  }
}
