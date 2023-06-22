import { Injectable, Inject, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FindOptionsRelations, Repository } from 'typeorm'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'
import { ConfigService } from '@nestjs/config'

import { SearchService } from '../../common/services/search-service/search.service'
import { CreateHostDto, DeleteBulkInvidiousDto, UpdateHostDto } from './dto'
import { InvidiousEntity } from './invidious.entity'
import { getRandomInt } from '../../utils'
import { InvidiousLogsService } from './invidious-logs.service'
import { INVIDIOUS_CACHE_KEY, getInvidiousСompositeCacheKey } from './invidious.constants'
import { CacheConfig } from '../../config/cache.config'

@Injectable()
export class InvidiousService extends SearchService<InvidiousEntity> {
  constructor(
    @InjectRepository(InvidiousEntity) private readonly invidiousRepository: Repository<InvidiousEntity>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly invidiousLogsService: InvidiousLogsService,
    private readonly configService: ConfigService
  ) {
    super(invidiousRepository)
  }

  public async findAll() {
    const invidiousCache = await this.cacheManager.get<InvidiousEntity[]>(INVIDIOUS_CACHE_KEY)
    if (invidiousCache) {
      return invidiousCache
    }

    const { invidiousCacheTtl } = this.configService.get<CacheConfig>('cache')
    const hosts = await this.invidiousRepository.find()
    await this.cacheManager.set(INVIDIOUS_CACHE_KEY, hosts, invidiousCacheTtl)

    return hosts
  }

  public async findOne(id: number, relations?: FindOptionsRelations<InvidiousEntity>) {
    const invidiousCache = await this.cacheManager.get<InvidiousEntity>(getInvidiousСompositeCacheKey(id))
    if (invidiousCache) {
      return invidiousCache
    }

    const entity = await this.invidiousRepository.findOne({ where: { id }, relations })

    if (!entity) {
      throw new NotFoundException('Invidious not found')
    }

    const { invidiousCacheTtl } = this.configService.get<CacheConfig>('cache')
    await this.cacheManager.set(getInvidiousСompositeCacheKey(id), entity, invidiousCacheTtl)

    return entity
  }

  public async findOneByHost(host: string) {
    const hostCache = await this.cacheManager.get<InvidiousEntity>(getInvidiousСompositeCacheKey(host))
    if (hostCache) {
      return hostCache
    }

    const { invidiousCacheTtl } = this.configService.get<CacheConfig>('cache')
    const hostEntity = await this.invidiousRepository.findOne({ where: { host } })
    await this.cacheManager.set(getInvidiousСompositeCacheKey(host), hostEntity, invidiousCacheTtl)

    return hostEntity
  }

  public getLogs(id: number) {
    return this.invidiousLogsService.getLogsByInvidiousId(id)
  }

  public async create(dto: CreateHostDto) {
    try {
      const { host } = dto
      const existEntity = await this.findOneByHost(host)

      if (existEntity) {
        return existEntity
      }

      let index = 0
      let { index: maxIndex } = await this.getMaxIndex()
      if (maxIndex !== null) {
        index = maxIndex + 1
      }
      await this.cacheManager.del(INVIDIOUS_CACHE_KEY)

      return this.invidiousRepository.save({ ...dto, index })
    } catch (e) {
      throw new InternalServerErrorException(e)
    }
  }

  public async update(id: number, dto: UpdateHostDto) {
    const entity = await this.invidiousRepository.findOne({ where: { id } })

    if (!entity) {
      throw new NotFoundException('Invidious not found')
    }

    let index = 0
    if (
      (dto.isActive !== undefined && dto.isActive === false) ||
      (dto.isWorkable !== undefined && dto.isWorkable === false)
    ) {
      index = -1
    }

    Object.assign(entity, { ...dto, index })
    const updateResult = await this.invidiousRepository.save(entity)
    await this.reIndex()

    await this.clearCache()

    return updateResult
  }

  public async delete(id: number) {
    const entity = await this.invidiousRepository.findOne({ where: { id } })

    if (!entity) {
      throw new NotFoundException('Invidious not found')
    }

    const deleteResult = await this.invidiousRepository.delete(id)
    await this.reIndex()

    await this.clearCache()

    return deleteResult
  }

  public async deleteBulk(dto: DeleteBulkInvidiousDto) {
    const { ids } = dto
    try {
      const deleteResult = await this.invidiousRepository.delete(ids)
      await this.reIndex()

      await this.clearCache()

      return deleteResult
    } catch (e) {
      throw new InternalServerErrorException(e)
    }
  }

  public async getMaxIndex() {
    const query = this.invidiousRepository.createQueryBuilder('invidious')
    query.select('MAX(invidious.index)', 'index')
    return await query.getRawOne()
  }

  public async updateHostState(
    invidious: InvidiousEntity,
    isWorkable: boolean,
    ping?: number
  ): Promise<InvidiousEntity> {
    if (ping !== undefined) {
      return await this.updatePing(invidious, ping)
    }

    await this.clearCache()

    return await this.invidiousRepository.save({ id: invidious.id, isWorkable })
  }

  public async updatePing(invidious: InvidiousEntity, ping: number) {
    let pingMin = Number(invidious.pingMin > ping ? ping : invidious.pingMin)
    if (invidious.pingMin === 0) {
      pingMin = Number(ping)
    }

    let pingAvg = Number(Math.ceil((invidious.pingAvg + ping) / 2))
    if (invidious.pingAvg === 0) {
      pingAvg = Number(ping)
    }

    const pingMax = Number(invidious.pingMax < ping ? ping : invidious.pingMax)

    await this.clearCache()

    return await this.invidiousRepository.save({
      id: invidious.id,
      pingAvg,
      pingMin,
      pingMax,
    })
  }

  public async getRandomHost(): Promise<InvidiousEntity | null> {
    try {
      const { index: maxIndex } = await this.getMaxIndex()

      if (maxIndex === null) {
        return null
      }

      const index = getRandomInt(0, maxIndex)

      const hostCache = await this.cacheManager.get<InvidiousEntity>(getInvidiousСompositeCacheKey(`index-${index}`))
      if (hostCache) {
        return hostCache
      }

      const cacheSettings = this.configService.get<CacheConfig>('cache')
      const hostEntity = await this.invidiousRepository.findOne({ where: { index } })
      await this.cacheManager.set(
        getInvidiousСompositeCacheKey(`index-${index}`),
        hostEntity,
        cacheSettings.invidiousCacheTtl
      )

      return hostEntity
    } catch (e) {
      throw new InternalServerErrorException(e)
    }
  }

  public async excludeHost(invidious: InvidiousEntity): Promise<void> {
    await this.clearCache()
    await this.invidiousRepository.save({ ...invidious, isWorkable: false, isActive: false, index: -1 })
  }

  public async reIndex() {
    try {
      const hosts = await this.invidiousRepository.find({ where: { isWorkable: true, isActive: true } })
      await Promise.all([
        hosts.map(async (host, index) => {
          await this.cacheManager.del(getInvidiousСompositeCacheKey(host.id))
          await this.invidiousRepository.save({ ...host, index })
        }),
      ])
      await this.clearCache()
    } catch (e) {
      throw new InternalServerErrorException(e)
    }
  }

  public async resetHostsState(): Promise<void> {
    try {
      const hosts = await this.invidiousRepository.find()
      await Promise.all([
        hosts.map(async (host) => {
          await this.invidiousRepository.update(host.id, {
            isActive: true,
            isWorkable: true,
            pingMin: 0,
            pingMax: 0,
            pingAvg: 0,
            index: 0,
          })
        }),
      ])
      await this.reIndex()
    } catch (e) {
      throw new InternalServerErrorException(e)
    }
  }

  public async addLog(id: number, message: string) {
    return this.invidiousLogsService.create({ invidiousId: id, message })
  }

  public async clearCache() {
    const keys: string[] = await this.cacheManager.store.keys()
    await Promise.all(
      keys.map(async (key) => {
        if (key.startsWith(INVIDIOUS_CACHE_KEY)) {
          await this.cacheManager.del(key)
        }
      })
    )
  }
}
