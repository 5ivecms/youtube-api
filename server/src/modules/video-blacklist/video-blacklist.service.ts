import { Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { DEFAULT_REDIS_NAMESPACE, InjectRedis } from '@liaoliaots/nestjs-redis'
import { Redis } from 'ioredis'
import { ConfigService } from '@nestjs/config'

import { VideoBlacklistEntity } from './video-blacklist.entity'
import {
  CreateBulkVideoBlacklistDto,
  CreateVideoBlacklistDto,
  DeleteBulkVideoBlacklistDto,
  UpdateVideoBlacklistDto,
} from './dto'
import { VIDEO_BLACKLIST_CACHE_KEY } from './constants'
import { SearchService } from '../../common/services/search-service/search.service'
import { CacheConfig } from '../../config/cache.config'

@Injectable()
export class VideoBlacklistService extends SearchService<VideoBlacklistEntity> {
  constructor(
    @InjectRedis(DEFAULT_REDIS_NAMESPACE) private readonly redis: Redis,
    // @InjectRedis('youtube-api') private readonly redisYt: Redis,
    @InjectRepository(VideoBlacklistEntity) private readonly videoBlacklistRepository: Repository<VideoBlacklistEntity>,
    private readonly configService: ConfigService
  ) {
    super(videoBlacklistRepository)
  }

  public async findAll(): Promise<VideoBlacklistEntity[]> {
    const videosCached = await this.getRedisCache<VideoBlacklistEntity[]>(VIDEO_BLACKLIST_CACHE_KEY)
    if (videosCached) {
      return videosCached
    }

    const { videoBlacklistCacheTtl } = this.configService.get<CacheConfig>('cache')
    const videos = await this.videoBlacklistRepository.find()
    await this.setRedisCache(VIDEO_BLACKLIST_CACHE_KEY, videos, videoBlacklistCacheTtl)

    return videos
  }

  public async blacklist(): Promise<string[]> {
    const entities = await this.findAll()
    return entities.map(({ videoId }) => videoId)
  }

  public async findOne(id: number) {
    const video = await this.videoBlacklistRepository.findOneBy({ id })

    if (!video) {
      throw new NotFoundException('Сущности не существует')
    }

    return video
  }

  public findByVideoId(videoId: string) {
    return this.videoBlacklistRepository.findOneBy({ videoId })
  }

  public async inBlacklist(videoId: string) {
    const videoBlacklist = await this.findByVideoId(videoId)
    return videoBlacklist !== null
  }

  public async create(dto: CreateVideoBlacklistDto) {
    try {
      const { videoId } = dto
      const existVideo = await this.videoBlacklistRepository.findOneBy({ videoId })

      if (existVideo) {
        return existVideo
      }

      const result = await this.videoBlacklistRepository.save(dto)

      await this.clearCache()
      // await this.clearYoutubeCache()
      // await this.clearYoutubeCache(videoId)

      return result
    } catch (e) {
      throw new InternalServerErrorException(e)
    }
  }

  public async createBulk(dto: CreateBulkVideoBlacklistDto): Promise<VideoBlacklistEntity[]> {
    const videoIds = await Promise.all(
      dto.videoIds.map(async (videoId) => {
        // await this.clearYoutubeCache(videoId)

        const existVideo = await this.videoBlacklistRepository.findOneBy({ videoId })
        if (existVideo) {
          return existVideo
        }

        return await this.videoBlacklistRepository.save({ videoId })
      })
    )

    await this.clearCache()
    // await this.clearYoutubeCache()

    return videoIds
  }

  public async update(id: number, dto: UpdateVideoBlacklistDto) {
    await this.findOne(id)
    const result = await this.videoBlacklistRepository.update(id, { videoId: dto.videoId.trim() })
    await this.clearCache()
    return result
  }

  public async delete(id: number) {
    const result = await this.videoBlacklistRepository.delete(id)
    await this.clearCache()
    return result
  }

  public async deleteBulk(dto: DeleteBulkVideoBlacklistDto) {
    const result = await this.videoBlacklistRepository.delete(dto.ids)
    await this.clearCache()
    return result
  }

  public async clear() {
    const result = await this.videoBlacklistRepository.clear()
    await this.clearCache()
    return result
  }

  public async clearCache() {
    await this.redis.del(VIDEO_BLACKLIST_CACHE_KEY)
  }

  // public async clearCache() {
  //   const keys = await this.redisYt.keys(`${VIDEO_BLACKLIST_CACHE_KEY}*`)
  //   if (keys.length) {
  //     await this.redis.del(...keys)
  //   }
  // }

  // public async clearYoutubeCache(compositeCacheKey = '') {
  //   if (compositeCacheKey.length > 0) {
  //     const cacheVideo = JSON.parse(
  //       await this.redisYt.get(CacheKeys.videoById(compositeCacheKey))
  //     ) as unknown as Video | null

  //     if (cacheVideo) {
  //       await this.redisYt.del(CacheKeys.videoByChannelId(cacheVideo.channelId))
  //     }

  //     await this.redisYt.del(CacheKeys.videoById(compositeCacheKey), CacheKeys.comments(compositeCacheKey))

  //     return
  //   }

  //   const keys = [
  //     CacheKeys.trends(),
  //     CacheKeys.categoriesWithVideos(),
  //     ...(await this.redisYt.keys(`${CacheKeys.videoByCategoryId()}*`)),
  //   ]

  //   await this.redisYt.del(...keys)
  // }

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
