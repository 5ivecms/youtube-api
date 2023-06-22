import { UseGuards, Body, Controller, Delete, Get, Param, Post, Put, Query, Patch } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

import { ProxyService } from './proxy.service'
import { CreateBulkProxyDto, CreateProxyDto, DeleteBulkProxyDto, UpdateProxyDto } from './dto'
import { SearchDto } from '../../common/services/search-service/search.dto'
import { ProxyEntity } from './proxy.entity'

@Controller('proxy')
export class ProxyController {
  constructor(private readonly proxyService: ProxyService) {}

  @UseGuards(AuthGuard(['jwt']))
  @Get()
  public findAll() {
    return this.proxyService.findAll()
  }

  @UseGuards(AuthGuard(['jwt']))
  @Get('random-proxy')
  public getRandomProxy() {
    return this.proxyService.getRandomProxy()
  }

  @UseGuards(AuthGuard(['jwt']))
  @Get('search')
  public search(@Query() dto: SearchDto<ProxyEntity>) {
    return this.proxyService.search(dto)
  }

  @UseGuards(AuthGuard(['jwt']))
  @Get(':id')
  public findOne(@Param('id') id: number) {
    return this.proxyService.findOne(+id)
  }

  @UseGuards(AuthGuard(['jwt']))
  @Post('create-bulk')
  public createBulk(@Body() dto: CreateBulkProxyDto) {
    return this.proxyService.createBulk(dto)
  }

  @UseGuards(AuthGuard(['jwt']))
  @Post()
  public create(@Body() dto: CreateProxyDto) {
    return this.proxyService.create(dto)
  }

  @UseGuards(AuthGuard(['jwt']))
  @Patch(':id')
  public update(@Body() dto: UpdateProxyDto, @Param('id') id: number) {
    return this.proxyService.update(+id, dto)
  }

  @UseGuards(AuthGuard(['jwt']))
  @Delete('delete-bulk')
  public deleteBulk(@Body() dto: DeleteBulkProxyDto) {
    return this.proxyService.deleteBulk(dto)
  }

  @UseGuards(AuthGuard(['jwt']))
  @Delete('clear')
  public clear() {
    return this.proxyService.clear()
  }

  @UseGuards(AuthGuard(['jwt']))
  @Delete(':id')
  public delete(@Param('id') id: number) {
    return this.proxyService.delete(+id)
  }
}
