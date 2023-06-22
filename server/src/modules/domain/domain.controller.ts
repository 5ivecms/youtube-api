import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

import { DomainService } from './domain.service'
import { CreateDomainDto, DeleteBulkDomainDto, UpdateDomainDto } from './dto'
import { SearchDto } from '../../common/services/search-service/search.dto'
import { DomainEntity } from './domain.entity'

@Controller('domain')
export class DomainController {
  constructor(private readonly domainService: DomainService) {}

  @UseGuards(AuthGuard(['jwt']))
  @Get()
  public findAll() {
    return this.domainService.findAll()
  }

  @UseGuards(AuthGuard(['jwt']))
  @Get('search')
  public search(@Query() dto: SearchDto<DomainEntity>) {
    return this.domainService.search(dto)
  }

  @UseGuards(AuthGuard(['jwt']))
  @Get(':id')
  public findOne(@Param('id') id: number) {
    return this.domainService.findOne(Number(id))
  }

  @UseGuards(AuthGuard(['jwt']))
  @Post()
  public create(@Body() dto: CreateDomainDto) {
    return this.domainService.create(dto)
  }

  @UseGuards(AuthGuard(['jwt']))
  @Patch(':id')
  public update(@Param('id') id: number, @Body() dto: UpdateDomainDto) {
    return this.domainService.update(Number(id), dto)
  }

  @UseGuards(AuthGuard(['jwt']))
  @Delete('delete-bulk')
  public deleteBulk(@Body() dto: DeleteBulkDomainDto) {
    return this.domainService.deleteBulk(dto)
  }

  @UseGuards(AuthGuard(['jwt']))
  @Delete('clear')
  public clear() {
    return this.domainService.clear()
  }

  @UseGuards(AuthGuard(['jwt']))
  @Delete(':id')
  public delete(@Param('id') id: number) {
    return this.domainService.delete(Number(id))
  }
}
