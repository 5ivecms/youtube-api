import { UseGuards, Body, Controller, Delete, Get, Param, Post, Query, Patch } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

import { SearchDto } from '../../common/services/search-service/search.dto'
import { CreateHostDto, DeleteBulkInvidiousDto, UpdateHostDto } from './dto'
import { InvidiousEntity } from './invidious.entity'
import { InvidiousService } from './invidious.service'

@Controller('invidious')
export class InvidiousController {
  constructor(private readonly invidiousService: InvidiousService) {}

  @UseGuards(AuthGuard(['jwt']))
  @Get()
  public findAll() {
    return this.invidiousService.findAll()
  }

  @UseGuards(AuthGuard(['jwt']))
  @Get('max-index')
  public getMaxIndex() {
    return this.invidiousService.getMaxIndex()
  }

  @UseGuards(AuthGuard(['jwt']))
  @Get('random-host')
  public getRandomHost() {
    return this.invidiousService.getRandomHost()
  }

  @UseGuards(AuthGuard(['jwt']))
  @Get('search')
  public search(@Query() dto: SearchDto<InvidiousEntity>) {
    return this.invidiousService.search(dto)
  }

  @UseGuards(AuthGuard(['jwt']))
  @Get(':id/logs')
  public getLogs(@Param('id') id: number) {
    return this.invidiousService.getLogs(+id)
  }

  @UseGuards(AuthGuard(['jwt']))
  @Get(':id')
  public findOne(@Param('id') id: number) {
    return this.invidiousService.findOne(+id)
  }

  @UseGuards(AuthGuard(['jwt']))
  @Post('reset-hosts-state')
  public resetHostsState() {
    return this.invidiousService.resetHostsState()
  }

  @UseGuards(AuthGuard(['jwt']))
  @Post()
  public create(@Body() dto: CreateHostDto) {
    return this.invidiousService.create(dto)
  }

  @UseGuards(AuthGuard(['jwt']))
  @Patch(':id')
  public update(@Body() dto: UpdateHostDto, @Param('id') id: number) {
    return this.invidiousService.update(+id, dto)
  }

  @UseGuards(AuthGuard(['jwt']))
  @Delete('delete-bulk')
  public deleteBulk(@Body() dto: DeleteBulkInvidiousDto) {
    return this.invidiousService.deleteBulk(dto)
  }

  @UseGuards(AuthGuard(['jwt']))
  @Delete(':id')
  public delete(@Param('id') id: number) {
    return this.invidiousService.delete(+id)
  }
}
