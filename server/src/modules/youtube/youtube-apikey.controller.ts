import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

import { YoutubeApikeyService } from './youtube-apikey.service'
import { SearchDto } from '../../common/services/search-service/search.dto'
import { YoutubeApikey } from './youtube-apikey.entity'
import {
  CreateBulkYoutubeApikeyDto,
  CreateYoutubeApikeyDto,
  DeleteBulkYoutubeApikeysDto,
  UpdateYoutubeApikeyDto,
} from './dto'

@Controller('youtube/apikey')
export class YoutubeApikeyController {
  constructor(private youtubeApikeyService: YoutubeApikeyService) {}

  @UseGuards(AuthGuard(['jwt']))
  @Get()
  public findAll() {
    return this.youtubeApikeyService.findAll()
  }

  @UseGuards(AuthGuard(['jwt']))
  @Get('next')
  public getNextKey() {
    return this.youtubeApikeyService.getNextKey()
  }

  @UseGuards(AuthGuard(['jwt']))
  @Get('search')
  public search(@Query() dto: SearchDto<YoutubeApikey>) {
    return this.youtubeApikeyService.search(dto)
  }

  @UseGuards(AuthGuard(['jwt']))
  @Get('quota-volume')
  public quotaVolume() {
    return this.youtubeApikeyService.quotaVolume()
  }

  @UseGuards(AuthGuard(['jwt']))
  @Get('statistic')
  public statistic() {
    return this.youtubeApikeyService.statistic()
  }

  @UseGuards(AuthGuard(['jwt']))
  @Get(':id')
  public findOne(@Param('id') id: number) {
    const paramId = Number(id)

    if (!paramId) {
      throw new BadRequestException('Неверный параметр')
    }

    return this.youtubeApikeyService.findOne(paramId)
  }

  @UseGuards(AuthGuard(['jwt']))
  @Post()
  public create(@Body() dto: CreateYoutubeApikeyDto) {
    return this.youtubeApikeyService.create(dto)
  }

  @UseGuards(AuthGuard(['jwt']))
  @Post('create-bulk')
  public createBulk(@Body() dto: CreateBulkYoutubeApikeyDto) {
    return this.youtubeApikeyService.createBulk(dto)
  }

  @UseGuards(AuthGuard(['jwt']))
  @Patch(':id')
  public update(@Body() dto: UpdateYoutubeApikeyDto, @Param('id') id: number) {
    return this.youtubeApikeyService.update(+id, dto)
  }

  @UseGuards(AuthGuard(['jwt']))
  @Delete('clear')
  public clear() {
    return this.youtubeApikeyService.clear()
  }

  @UseGuards(AuthGuard(['jwt']))
  @Delete('delete-bulk')
  public deleteBulk(@Body() dto: DeleteBulkYoutubeApikeysDto) {
    return this.youtubeApikeyService.deleteBulk(dto)
  }

  @UseGuards(AuthGuard(['jwt']))
  @Delete(':id')
  public delete(@Param('id') id: number) {
    return this.youtubeApikeyService.delete(+id)
  }
}
