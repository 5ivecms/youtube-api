import { Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { ConfigService } from '@nestjs/config'
import { Cache } from 'cache-manager'

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
    @InjectRepository(ChannelBlacklistEntity)
    private readonly channelBlacklistRepository: Repository<ChannelBlacklistEntity>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly configService: ConfigService
  ) {
    super(channelBlacklistRepository)
  }

  public async findAll(): Promise<ChannelBlacklistEntity[]> {
    const channelsCached = await this.cacheManager.get<ChannelBlacklistEntity[]>(CHANNEL_BLACKLIST_CACHE_KEY)
    if (channelsCached) {
      return channelsCached
    }

    const { videoBlacklistCacheTtl } = this.configService.get<CacheConfig>('cache')
    const videos = await this.channelBlacklistRepository.find()
    await this.cacheManager.set(CHANNEL_BLACKLIST_CACHE_KEY, videos, videoBlacklistCacheTtl)

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
      await this.clearAllCache()

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
      await this.clearAllCache()

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
    const keys: string[] = await this.cacheManager.store.keys()
    await Promise.all(
      keys.map(async (key) => {
        if (key.startsWith(CHANNEL_BLACKLIST_CACHE_KEY)) {
          await this.cacheManager.del(key)
        }
      })
    )
  }

  public async clearChannelCache(channelId: string) {
    const keys: string[] = await this.cacheManager.store.keys()

    const cachedVideo = await this.cacheManager.get<Video[]>(CacheKeys.videoByChannelId(channelId))
    const videoCacheKeys = cachedVideo.map((video) => CacheKeys.videoById(video.id))

    await Promise.all(
      keys.map(async (key) => {
        if (key.startsWith(CacheKeys.videoByChannelId(channelId))) {
          await this.cacheManager.del(key)
          return
        }
        if (videoCacheKeys.includes(key)) {
          await this.cacheManager.del(key)
          return
        }
      })
    )
  }

  public async clearChannelsCache(channelIds: string[]) {
    const keys: string[] = await this.cacheManager.store.keys()
    const prepareChannelsKeys = channelIds.map((channelId) => CacheKeys.videoByChannelId(channelId))
    const prepareVideosKeys = (
      await Promise.all(
        channelIds.map(async (channelId) => {
          return await this.cacheManager.get<Video[]>(CacheKeys.videoByChannelId(channelId))
        })
      )
    )
      .flat()
      .filter((video) => video !== undefined)
      .map((video) => CacheKeys.videoById(video.id))

    await Promise.all(
      keys.map(async (key) => {
        if (prepareChannelsKeys.includes(key) || prepareVideosKeys.includes(key)) {
          await this.cacheManager.del(key)
        }
      })
    )
  }

  public async clearAllCache() {
    const keys: string[] = await this.cacheManager.store.keys()
    await Promise.all(
      keys.map(async (key) => {
        if (
          key.startsWith(CacheKeys.trends()) ||
          key.startsWith(CacheKeys.categoriesWithVideos()) ||
          key.startsWith(CacheKeys.videoByCategoryId()) ||
          key.startsWith(CacheKeys.search()) ||
          key.startsWith(CacheKeys.videoByChannelId())
        ) {
          await this.cacheManager.del(key)
        }
      })
    )
  }
}
