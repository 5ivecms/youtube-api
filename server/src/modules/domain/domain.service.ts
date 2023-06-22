import { Injectable, Inject, NotFoundException, InternalServerErrorException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DeleteResult, Repository, UpdateResult } from 'typeorm'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'
import { ConfigService } from '@nestjs/config'

import { DomainEntity } from './domain.entity'
import { CreateDomainDto, DeleteBulkDomainDto, UpdateDomainDto } from './dto'
import { SearchService } from '../../common/services/search-service/search.service'
import { ApiKeyService } from '../api-key/api-key.service'
import { DOMAINS_CACHE_KEY, getDomainByIdCacheKey } from './domain.constants'
import { CacheConfig } from '../../config/cache.config'

@Injectable()
export class DomainService extends SearchService<DomainEntity> {
  constructor(
    @InjectRepository(DomainEntity) private readonly domainRepository: Repository<DomainEntity>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly apiKeyService: ApiKeyService,
    private readonly configService: ConfigService
  ) {
    super(domainRepository)
  }

  public async findAll(): Promise<DomainEntity[]> {
    const domainsCache = await this.cacheManager.get<DomainEntity[]>(DOMAINS_CACHE_KEY)
    if (domainsCache) {
      return domainsCache
    }

    const { domainsCacheTtl } = this.configService.get<CacheConfig>('cache')
    const domains = await this.domainRepository.find()
    await this.cacheManager.set(DOMAINS_CACHE_KEY, domains, domainsCacheTtl)

    return domains
  }

  public async findOne(id: number): Promise<DomainEntity> {
    const domainCache = await this.cacheManager.get<DomainEntity>(getDomainByIdCacheKey(id))
    if (domainCache) {
      return domainCache
    }

    const domain = await this.domainRepository.findOneBy({ id })

    if (!domain) {
      throw new NotFoundException('Domain not found')
    }

    const { domainsCacheTtl } = this.configService.get<CacheConfig>('cache')
    await this.cacheManager.set(getDomainByIdCacheKey(id), domain, domainsCacheTtl)

    return domain
  }

  public async create(dto: CreateDomainDto): Promise<DomainEntity> {
    const domain = this.domainRepository.create(dto)
    const apiKey = await this.apiKeyService.create({ comment: '' })
    domain.apiKey = apiKey

    await this.clearCache()

    return this.domainRepository.save(domain)
  }

  public async update(id: number, dto: UpdateDomainDto): Promise<UpdateResult> {
    await this.findOne(id)
    await this.clearCache()
    return this.domainRepository.update(id, dto)
  }

  public async delete(id: number): Promise<DeleteResult> {
    const domain = await this.findOne(id)
    const deleteResult = await this.domainRepository.delete(id)
    await this.apiKeyService.delete(domain.apiKeyId)
    await this.clearCache()
    return deleteResult
  }

  public async deleteBulk(dto: DeleteBulkDomainDto) {
    const { ids } = dto
    try {
      await this.clearCache()
      return await this.domainRepository.delete(ids)
    } catch (e) {
      throw new InternalServerErrorException(e)
    }
  }

  public async clear() {
    await this.clearCache()
    return this.domainRepository.clear()
  }

  public async clearCache() {
    const keys: string[] = await this.cacheManager.store.keys()
    await Promise.all(
      keys.map(async (key) => {
        if (key.startsWith(DOMAINS_CACHE_KEY)) {
          await this.cacheManager.del(key)
        }
      })
    )
  }
}
