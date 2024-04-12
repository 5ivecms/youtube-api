import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

import { ChannelBlacklistService } from './channel-blacklist.service'
import { SearchDto } from '../../common/services/search-service/search.dto'
import { ChannelBlacklistEntity } from './channel-blacklist.entity'
import {
  CreateBulkChannelBlacklistDto,
  CreateChannelBlacklistDto,
  DeleteBulkChannelBlacklistDto,
  UpdateChannelBlacklistDto,
} from './dto'

@Controller('channel-blacklist')
export class ChannelBlacklistController {
  constructor(private readonly channelBlacklistService: ChannelBlacklistService) {}

  @UseGuards(AuthGuard(['jwt']))
  @Get()
  public findAll() {
    return this.channelBlacklistService.findAll()
  }

  @UseGuards(AuthGuard(['jwt']))
  @Get('search')
  public search(@Query() dto: SearchDto<ChannelBlacklistEntity>) {
    return this.channelBlacklistService.search(dto)
  }

  @UseGuards(AuthGuard(['jwt']))
  @Get(':id')
  public findOne(@Param('id') id: number) {
    return this.channelBlacklistService.findOne(Number(id))
  }

  @UseGuards(AuthGuard(['api-key', 'jwt']))
  @Post()
  public create(@Body() dto: CreateChannelBlacklistDto) {
    return this.channelBlacklistService.create(dto)
  }

  @UseGuards(AuthGuard(['jwt']))
  @Post('create-bulk')
  public createBulk(@Body() dto: CreateBulkChannelBlacklistDto) {
    return this.channelBlacklistService.createBulk(dto)
  }

  @UseGuards(AuthGuard(['jwt']))
  @Patch(':id')
  public update(@Body() dto: UpdateChannelBlacklistDto, @Param('id') id: number) {
    return this.channelBlacklistService.update(Number(id), dto)
  }

  @UseGuards(AuthGuard(['jwt']))
  @Delete('delete-bulk')
  public deleteBulk(@Body() dto: DeleteBulkChannelBlacklistDto) {
    return this.channelBlacklistService.deleteBulk(dto)
  }

  @UseGuards(AuthGuard(['jwt']))
  @Delete('clear')
  public clear() {
    return this.channelBlacklistService.clear()
  }

  @UseGuards(AuthGuard(['jwt']))
  @Delete(':id')
  public delete(@Param('id') id: number) {
    return this.channelBlacklistService.delete(Number(id))
  }
}
