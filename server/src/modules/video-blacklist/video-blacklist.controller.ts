import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

import { VideoBlacklistService } from './video-blacklist.service'
import { SearchDto } from '../../common/services/search-service/search.dto'
import { VideoBlacklistEntity } from './video-blacklist.entity'
import {
  CreateBulkVideoBlacklistDto,
  CreateVideoBlacklistDto,
  DeleteBulkVideoBlacklistDto,
  UpdateVideoBlacklistDto,
} from './dto'

@Controller('video-blacklist')
export class VideoBlacklistController {
  constructor(private readonly videoBlacklistService: VideoBlacklistService) {}

  @UseGuards(AuthGuard(['jwt']))
  @Get()
  public findAll() {
    return this.videoBlacklistService.findAll()
  }

  @UseGuards(AuthGuard(['jwt']))
  @Get('search')
  public search(@Query() dto: SearchDto<VideoBlacklistEntity>) {
    return this.videoBlacklistService.search(dto)
  }

  @UseGuards(AuthGuard(['jwt']))
  @Get(':id')
  public findOne(@Param('id') id: number) {
    return this.videoBlacklistService.findOne(Number(id))
  }

  @UseGuards(AuthGuard(['jwt']))
  @Post()
  public create(@Body() dto: CreateVideoBlacklistDto) {
    return this.videoBlacklistService.create(dto)
  }

  @UseGuards(AuthGuard(['jwt']))
  @Post('create-bulk')
  public createBulk(@Body() dto: CreateBulkVideoBlacklistDto) {
    return this.videoBlacklistService.createBulk(dto)
  }

  @UseGuards(AuthGuard(['jwt']))
  @Patch(':id')
  public update(@Body() dto: UpdateVideoBlacklistDto, @Param('id') id: number) {
    return this.videoBlacklistService.update(Number(id), dto)
  }

  @UseGuards(AuthGuard(['jwt']))
  @Delete('delete-bulk')
  public deleteBulk(@Body() dto: DeleteBulkVideoBlacklistDto) {
    return this.videoBlacklistService.deleteBulk(dto)
  }

  @UseGuards(AuthGuard(['jwt']))
  @Delete('clear')
  public clear() {
    return this.videoBlacklistService.clear()
  }

  @UseGuards(AuthGuard(['jwt']))
  @Delete(':id')
  public delete(@Param('id') id: number) {
    return this.videoBlacklistService.delete(Number(id))
  }
}
