import { Controller, Get, Query, UseGuards } from '@nestjs/common'

import { YoutubeApiService } from './youtube-api.service'
import {
  YoutubeApiCommentsDto,
  YoutubeApiSearchDto,
  YoutubeApiVideoByCategoryIdDto,
  YoutubeApiVideoByChannelIdDto,
  YoutubeApiVideoById,
  YoutubeApiVideoByPlaylistId,
} from './dto'
import { AuthGuard } from '@nestjs/passport'

@Controller('youtube/api')
export class YoutubeApiController {
  constructor(private readonly youtubeApiService: YoutubeApiService) {}

  @UseGuards(AuthGuard(['api-key', 'jwt']))
  @Get('search')
  public search(@Query() dto: YoutubeApiSearchDto) {
    return this.youtubeApiService.search(dto)
  }

  @UseGuards(AuthGuard(['api-key', 'jwt']))
  @Get('categories')
  public videoCategories() {
    return this.youtubeApiService.categories()
  }

  @UseGuards(AuthGuard(['api-key', 'jwt']))
  @Get('video-full')
  public videoFull(@Query() dto: YoutubeApiVideoById) {
    return this.youtubeApiService.videoFull(dto)
  }

  @UseGuards(AuthGuard(['api-key', 'jwt']))
  @Get('video-by-id')
  public videoById(@Query() dto: YoutubeApiVideoById) {
    return this.youtubeApiService.videoById(dto)
  }

  @UseGuards(AuthGuard(['api-key', 'jwt']))
  @Get('video-by-ids')
  public videoByIds(@Query() dto: YoutubeApiVideoById) {
    return this.youtubeApiService.videoByIds(dto)
  }

  @UseGuards(AuthGuard(['api-key', 'jwt']))
  @Get('video-by-category-id')
  public videoByCategoryId(@Query() dto: YoutubeApiVideoByCategoryIdDto) {
    return this.youtubeApiService.videoByCategoryId(dto)
  }

  @UseGuards(AuthGuard(['api-key', 'jwt']))
  @Get('video-by-channel-id')
  public videoByChannelId(@Query() dto: YoutubeApiVideoByChannelIdDto) {
    return this.youtubeApiService.videoByChannelId(dto)
  }

  @UseGuards(AuthGuard(['api-key', 'jwt']))
  @Get('video-by-playlist-id')
  public videoByPlaylistId(@Query() dto: YoutubeApiVideoByPlaylistId) {
    return this.youtubeApiService.videoByPlaylistId(dto)
  }

  @UseGuards(AuthGuard(['api-key', 'jwt']))
  @Get('trends')
  public trends() {
    return this.youtubeApiService.trends()
  }

  @UseGuards(AuthGuard(['api-key', 'jwt']))
  @Get('comments')
  public comments(@Query() dto: YoutubeApiCommentsDto) {
    return this.youtubeApiService.comments(dto)
  }

  @UseGuards(AuthGuard(['api-key', 'jwt']))
  @Get('categories-with-videos')
  public categoriesWithVideos() {
    return this.youtubeApiService.categoriesWithVideos()
  }
}
