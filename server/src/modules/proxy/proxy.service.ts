import { InternalServerErrorException, Inject, NotFoundException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'
import { ConfigService } from '@nestjs/config'

import { CreateBulkProxyDto, CreateProxyDto, DeleteBulkProxyDto, UpdateProxyDto } from './dto'
import { ProxyEntity } from './proxy.entity'
import { SearchService } from '../../common/services/search-service/search.service'
import { getRandomInt } from '../../utils'
import { PROXIES_CACHE_KEY, getProxiesСompositeCacheKey } from './proxy.constants'
import { CacheConfig } from '../../config/cache.config'

@Injectable()
export class ProxyService extends SearchService<ProxyEntity> {
  constructor(
    @InjectRepository(ProxyEntity) private readonly proxyRepository: Repository<ProxyEntity>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly configService: ConfigService
  ) {
    super(proxyRepository)
  }

  public async findAll() {
    const proxyCache = await this.cacheManager.get<ProxyEntity[]>(PROXIES_CACHE_KEY)
    if (proxyCache) {
      return proxyCache
    }

    const { proxyCacheTtl } = this.configService.get<CacheConfig>('cache')
    const proxies = await this.proxyRepository.find()
    await this.cacheManager.set(PROXIES_CACHE_KEY, proxies, proxyCacheTtl)

    return proxies
  }

  public async findOne(id: number) {
    const proxyCache = await this.cacheManager.get<ProxyEntity>(getProxiesСompositeCacheKey(id))
    if (proxyCache) {
      return proxyCache
    }

    const entity = await this.proxyRepository.findOne({ where: { id } })

    if (!entity) {
      throw new NotFoundException('Proxy not found')
    }

    const { proxyCacheTtl } = this.configService.get<CacheConfig>('cache')
    await this.cacheManager.set(getProxiesСompositeCacheKey(id), entity, proxyCacheTtl)

    return entity
  }

  public async create(dto: CreateProxyDto) {
    try {
      const { ip, port, protocol } = dto
      const existEntity = await this.proxyRepository.findOne({ where: { ip, port, protocol } })

      if (existEntity) {
        return existEntity
      }

      let index = 0
      let { index: maxIndex } = await this.getMaxIndex()
      if (maxIndex !== null) {
        index = maxIndex + 1
      }

      await this.clearCache()

      return await this.proxyRepository.save({ ...dto, index })
    } catch (e) {
      throw new InternalServerErrorException(e)
    }
  }

  public async createBulk(dto: CreateBulkProxyDto) {
    const { proxies } = dto
    try {
      let index = 0
      let { index: maxIndex } = await this.getMaxIndex()
      if (maxIndex !== null) {
        index = maxIndex + 1
      }

      await this.clearCache()

      return await Promise.all(
        proxies.map(async (proxy, idx) => {
          return await this.proxyRepository.save({ ...proxy, index: index + idx })
        })
      )
    } catch (e) {
      throw new InternalServerErrorException(e)
    }
  }

  public async update(id: number, dto: UpdateProxyDto) {
    const entity = await this.proxyRepository.findOne({ where: { id } })
    if (!entity) {
      throw new NotFoundException('Proxy not found')
    }

    await this.clearCache()

    return this.proxyRepository.update(id, dto)
  }

  public async delete(id: number) {
    const entity = await this.proxyRepository.findOne({ where: { id } })

    if (!entity) {
      throw new NotFoundException('Proxy not found')
    }

    const deleteResult = await this.proxyRepository.delete(id)
    await this.reIndex()

    return deleteResult
  }

  public async deleteBulk(dto: DeleteBulkProxyDto) {
    const { ids } = dto
    try {
      const deleteResult = await this.proxyRepository.delete(ids)
      await this.reIndex()

      return deleteResult
    } catch (e) {
      throw new InternalServerErrorException(e)
    }
  }

  public async clear() {
    await this.clearCache()
    return this.proxyRepository.clear()
  }

  public async getRandomProxy() {
    try {
      const { index: maxIndex } = await this.getMaxIndex()

      if (maxIndex === null) {
        return null
      }

      const index = getRandomInt(0, maxIndex)
      const proxyCache = await this.cacheManager.get<ProxyEntity>(getProxiesСompositeCacheKey(`index-${index}`))
      if (proxyCache) {
        return proxyCache
      }

      const { proxyCacheTtl } = this.configService.get<CacheConfig>('cache')
      const proxy = await this.proxyRepository.findOne({ where: { index } })
      await this.cacheManager.set(getProxiesСompositeCacheKey(`index-${index}`), proxy, proxyCacheTtl)

      return proxy
    } catch (e) {
      throw new InternalServerErrorException(e)
    }
  }

  private async getMaxIndex() {
    const query = this.proxyRepository.createQueryBuilder('proxy')
    query.select('MAX(proxy.index)', 'index')
    return await query.getRawOne()
  }

  private async reIndex() {
    try {
      const proxies = await this.proxyRepository.find()

      await Promise.all([
        proxies.map(async (proxy, index) => {
          await this.proxyRepository.save({ ...proxy, index })
        }),
      ])

      await this.clearCache()
    } catch (e) {
      throw new InternalServerErrorException(e)
    }
  }

  public async clearCache() {
    const keys: string[] = await this.cacheManager.store.keys()
    await Promise.all(
      keys.map(async (key) => {
        if (key.startsWith(PROXIES_CACHE_KEY)) {
          await this.cacheManager.del(key)
        }
      })
    )
  }
}
