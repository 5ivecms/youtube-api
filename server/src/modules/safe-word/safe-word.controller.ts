import { UseGuards, Delete, Controller, Get, Post, Body, Put, Param, Query, Patch } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

import { SafeWordService } from './safe-word.service'
import { CreateBulkSafeWordDto, CreateSafeWordDto, DeleteBulkSafeWordDto, UpdateSafeWordDto } from './dto'
import { SearchDto } from 'src/common/services/search-service/search.dto'
import { SafeWordEntity } from './safe-word.entity'

@Controller('safe-word')
export class SafeWordController {
  constructor(private readonly safeWordService: SafeWordService) {}

  @UseGuards(AuthGuard(['jwt']))
  @Get()
  public findAll() {
    return this.safeWordService.findAll()
  }

  @UseGuards(AuthGuard(['jwt']))
  @Get('search')
  public search(@Query() dto: SearchDto<SafeWordEntity>) {
    return this.safeWordService.search(dto)
  }

  @UseGuards(AuthGuard(['jwt']))
  @Get(':id')
  public findOne(@Param('id') id: number) {
    return this.safeWordService.findOne(Number(id))
  }

  @UseGuards(AuthGuard(['jwt']))
  @Post()
  public create(@Body() dto: CreateSafeWordDto) {
    return this.safeWordService.create(dto)
  }

  @UseGuards(AuthGuard(['jwt']))
  @Post('create-bulk')
  public createBulk(@Body() dto: CreateBulkSafeWordDto) {
    return this.safeWordService.createBulk(dto)
  }

  @UseGuards(AuthGuard(['jwt']))
  @Patch(':id')
  public update(@Body() dto: UpdateSafeWordDto, @Param('id') id: number) {
    return this.safeWordService.update(Number(id), dto)
  }

  @UseGuards(AuthGuard(['jwt']))
  @Delete('delete-bulk')
  public deleteBulk(@Body() dto: DeleteBulkSafeWordDto) {
    return this.safeWordService.deleteBulk(dto)
  }

  @UseGuards(AuthGuard(['jwt']))
  @Delete('clear')
  public clear() {
    return this.safeWordService.clear()
  }

  @UseGuards(AuthGuard(['jwt']))
  @Delete(':id')
  public delete(@Param('id') id: number) {
    return this.safeWordService.delete(Number(id))
  }
}
