import { Controller, Get, Query } from '@nestjs/common'

import { YoutubeApiService } from './youtube-api.service'
import {
  YoutubeApiCommentsDto,
  YoutubeApiSearchDto,
  YoutubeApiVideoByCategoryIdDto,
  YoutubeApiVideoByChannelIdDto,
  YoutubeApiVideoById,
  YoutubeApiVideoByPlaylistId,
} from './dto'

@Controller('youtube/api')
export class YoutubeApiController {
  constructor(private readonly youtubeApiService: YoutubeApiService) {}

  @Get('search')
  public search(@Query() dto: YoutubeApiSearchDto) {
    return this.youtubeApiService.search(dto)
  }

  @Get('categories')
  public videoCategories() {
    return this.youtubeApiService.categories()
  }

  @Get('video-by-id')
  public videoById(@Query() dto: YoutubeApiVideoById) {
    return this.youtubeApiService.videoById(dto)
  }

  @Get('video-by-category-id')
  public videoByCategoryId(@Query() dto: YoutubeApiVideoByCategoryIdDto) {
    return this.youtubeApiService.videoByCategoryId(dto)
  }

  @Get('video-by-channel-id')
  public videoByChannelId(@Query() dto: YoutubeApiVideoByChannelIdDto) {
    return this.youtubeApiService.videoByChannelId(dto)
  }

  @Get('video-by-playlist-id')
  public videoByPlaylistId(@Query() dto: YoutubeApiVideoByPlaylistId) {
    return this.youtubeApiService.videoByPlaylistId(dto)
  }

  @Get('trends')
  public trends() {
    return this.youtubeApiService.trends()
  }

  @Get('comments')
  public comments(@Query() dto: YoutubeApiCommentsDto) {
    return this.youtubeApiService.comments(dto)
  }

  @Get('categories-with-videos')
  public categoriesWithVideos() {
    return this.youtubeApiService.categoriesWithVideos()
  }
}
