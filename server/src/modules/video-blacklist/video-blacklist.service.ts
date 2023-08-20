import { Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'
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
import { CacheKeys } from '../youtube/utils'

@Injectable()
export class VideoBlacklistService extends SearchService<VideoBlacklistEntity> {
  constructor(
    @InjectRepository(VideoBlacklistEntity) private readonly videoBlacklistRepository: Repository<VideoBlacklistEntity>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly configService: ConfigService
  ) {
    super(videoBlacklistRepository)
  }

  public async findAll(): Promise<VideoBlacklistEntity[]> {
    const videosCached = await this.cacheManager.get<VideoBlacklistEntity[]>(VIDEO_BLACKLIST_CACHE_KEY)
    if (videosCached) {
      return videosCached
    }

    const { videoBlacklistCacheTtl } = this.configService.get<CacheConfig>('cache')
    const videos = await this.videoBlacklistRepository.find()
    await this.cacheManager.set(VIDEO_BLACKLIST_CACHE_KEY, videos, videoBlacklistCacheTtl)

    return videos
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

      await this.clearCache()
      await this.clearYoutubeCache()
      await this.clearYoutubeCache(videoId)

      return await this.videoBlacklistRepository.save(dto)
    } catch (e) {
      throw new InternalServerErrorException(e)
    }
  }

  public async createBulk(dto: CreateBulkVideoBlacklistDto): Promise<VideoBlacklistEntity[]> {
    const videoIds = await Promise.all(
      dto.videoIds.map(async (videoId) => {
        await this.clearYoutubeCache(videoId)

        const existVideo = await this.videoBlacklistRepository.findOneBy({ videoId })
        if (existVideo) {
          return existVideo
        }

        return await this.videoBlacklistRepository.save({ videoId })
      })
    )

    await this.clearCache()
    await this.clearYoutubeCache()

    return videoIds
  }

  public async update(id: number, dto: UpdateVideoBlacklistDto) {
    await this.findOne(id)
    await this.clearCache()
    return this.videoBlacklistRepository.update(id, { videoId: dto.videoId.trim() })
  }

  public async delete(id: number) {
    await this.clearCache()
    return this.videoBlacklistRepository.delete(id)
  }

  public async deleteBulk(dto: DeleteBulkVideoBlacklistDto) {
    await this.clearCache()
    return this.videoBlacklistRepository.delete(dto.ids)
  }

  public async clear() {
    await this.clearCache()
    return this.videoBlacklistRepository.clear()
  }

  public async clearCache() {
    const keys: string[] = await this.cacheManager.store.keys()
    await Promise.all(
      keys.map(async (key) => {
        if (key.startsWith(VIDEO_BLACKLIST_CACHE_KEY)) {
          await this.cacheManager.del(key)
        }
      })
    )
  }

  public async clearYoutubeCache(compositeCacheKey = '') {
    const keys: string[] = await this.cacheManager.store.keys()

    await Promise.all(
      keys.map(async (key) => {
        if (compositeCacheKey.length > 0) {
          if (
            key.startsWith(CacheKeys.videoById(compositeCacheKey)) ||
            key.startsWith(CacheKeys.comments(compositeCacheKey))
          ) {
            await this.cacheManager.del(key)
            return
          }
        }

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
