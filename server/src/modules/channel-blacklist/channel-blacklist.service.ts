import { Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { DEFAULT_REDIS_NAMESPACE, InjectRedis } from '@liaoliaots/nestjs-redis'
import { Redis } from 'ioredis'
import { ConfigService } from '@nestjs/config'

import { CHANNEL_BLACKLIST_CACHE_KEY } from './constants'
import { SearchService } from '../../common/services/search-service/search.service'
import { ChannelBlacklistEntity } from './channel-blacklist.entity'
import { CacheConfig } from '../../config/cache.config'
import {
  CreateBulkChannelBlacklistDto,
  CreateChannelBlacklistDto,
  DeleteBulkChannelBlacklistDto,
  UpdateChannelBlacklistDto,
} from './dto'
import { CacheKeys } from '../youtube/utils'
import { Video } from '../youtube/youtube-api.types'

@Injectable()
export class ChannelBlacklistService extends SearchService<ChannelBlacklistEntity> {
  constructor(
    @InjectRedis(DEFAULT_REDIS_NAMESPACE) private readonly redis: Redis,
    @InjectRedis('youtube-api') private readonly redisYt: Redis,
    @InjectRepository(ChannelBlacklistEntity)
    private readonly channelBlacklistRepository: Repository<ChannelBlacklistEntity>,
    private readonly configService: ConfigService
  ) {
    super(channelBlacklistRepository)
  }

  public async findAll(): Promise<ChannelBlacklistEntity[]> {
    const channelsCached = await this.getRedisCache<ChannelBlacklistEntity[]>(CHANNEL_BLACKLIST_CACHE_KEY)
    if (channelsCached) {
      return channelsCached
    }

    const { videoBlacklistCacheTtl } = this.configService.get<CacheConfig>('cache')
    const videos = await this.channelBlacklistRepository.find()
    await this.setRedisCache(CHANNEL_BLACKLIST_CACHE_KEY, videos, videoBlacklistCacheTtl)

    return videos
  }

  public async blacklist() {
    return (await this.findAll()).map((item) => item.channelId)
  }

  public async findOne(id: number) {
    const channel = await this.channelBlacklistRepository.findOneBy({ id })

    if (!channel) {
      throw new NotFoundException('Сущности не существует')
    }

    return channel
  }

  public findByChannelId(channelId: string) {
    return this.channelBlacklistRepository.findOneBy({ channelId })
  }

  public async inBlacklist(channelId: string) {
    const channelBlacklist = await this.findByChannelId(channelId)
    return channelBlacklist !== null
  }

  public async create(dto: CreateChannelBlacklistDto) {
    try {
      const { channelId } = dto
      const existChannel = await this.channelBlacklistRepository.findOneBy({ channelId })

      if (existChannel) {
        return existChannel
      }

      await this.clearCache()
      await this.clearChannelCache(channelId)
      await this.clearYtCache()

      return await this.channelBlacklistRepository.save(dto)
    } catch (e) {
      throw new InternalServerErrorException(e)
    }
  }

  public async createBulk(dto: CreateBulkChannelBlacklistDto): Promise<ChannelBlacklistEntity[]> {
    try {
      const { channelIds } = dto
      const createdChannels = await Promise.all(
        channelIds.map(async (channelId) => {
          return await this.channelBlacklistRepository.save({ channelId })
        })
      )

      await this.clearCache()
      await this.clearChannelsCache(channelIds)
      await this.clearYtCache()

      return createdChannels
    } catch (e) {
      throw new InternalServerErrorException(e)
    }
  }

  public async update(id: number, dto: UpdateChannelBlacklistDto) {
    await this.findOne(id)

    const updated = await this.channelBlacklistRepository.update(id, { channelId: dto.channelId })
    await this.clearCache()

    return updated
  }

  public async delete(id: number) {
    await this.clearCache()
    return this.channelBlacklistRepository.delete(id)
  }

  public async deleteBulk(dto: DeleteBulkChannelBlacklistDto) {
    await this.clearCache()
    return this.channelBlacklistRepository.delete(dto.channelIds)
  }

  public async clear() {
    await this.clearCache()
    return this.channelBlacklistRepository.clear()
  }

  public async clearCache() {
    await this.redis.del(CHANNEL_BLACKLIST_CACHE_KEY)
  }

  public async clearChannelCache(channelId: string) {
    const cachedVideo = JSON.parse(await this.redisYt.get(CacheKeys.videoByChannelId(channelId))) as unknown as
      | Video[]
      | null

    await this.redisYt.del(CacheKeys.videoByChannelId(channelId))

    if (!cachedVideo) {
      return
    }

    const videoCacheKeys = cachedVideo.filter((video) => video !== null).map((video) => CacheKeys.videoById(video.id))
    await this.redisYt.del(...videoCacheKeys)
  }

  public async clearChannelsCache(channelIds: string[]) {
    await Promise.all(
      channelIds.map(async (channelId) => {
        await this.clearChannelCache(channelId)
      })
    )
  }

  public async clearYtCache() {
    const keys = [
      CacheKeys.trends(),
      CacheKeys.categoriesWithVideos(),
      ...(await this.redisYt.keys(`${CacheKeys.videoByCategoryId()}*`)),
    ]
    await this.redisYt.del(...keys)
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
