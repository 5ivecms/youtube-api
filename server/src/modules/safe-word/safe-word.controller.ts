import { UseGuards, Delete, Controller, Get, Post, Body, Param, Query, Patch } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

import { SafeWordService } from './safe-word.service'
import { CreateBulkSafeWordDto, CreateSafeWordDto, DeleteBulkSafeWordDto, UpdateSafeWordDto } from './dto'
import { SearchDto } from 'src/common/services/search-service/search.dto'
import { SafeWordEntity } from './safe-word.entity'

@Controller('safe-word')
export class SafeWordController {
  constructor(private readonly safeWordService: SafeWordService) {}

  @UseGuards(AuthGuard(['api-key', 'jwt']))
  @Get()
  public findAll() {
    return this.safeWordService.findAll()
  }

  @UseGuards(AuthGuard(['api-key', 'jwt']))
  @Get('search')
  public search(@Query() dto: SearchDto<SafeWordEntity>) {
    return this.safeWordService.search(dto)
  }

  @UseGuards(AuthGuard(['api-key', 'jwt']))
  @Get(':id')
  public findOne(@Param('id') id: number) {
    return this.safeWordService.findOne(Number(id))
  }

  @UseGuards(AuthGuard(['api-key', 'jwt']))
  @Post()
  public create(@Body() dto: CreateSafeWordDto) {
    return this.safeWordService.create(dto)
  }

  @UseGuards(AuthGuard(['api-key', 'jwt']))
  @Post('create-bulk')
  public createBulk(@Body() dto: CreateBulkSafeWordDto) {
    return this.safeWordService.createBulk(dto)
  }

  @UseGuards(AuthGuard(['api-key', 'jwt']))
  @Patch(':id')
  public update(@Body() dto: UpdateSafeWordDto, @Param('id') id: number) {
    return this.safeWordService.update(Number(id), dto)
  }

  @UseGuards(AuthGuard(['api-key', 'jwt']))
  @Delete('delete-bulk')
  public deleteBulk(@Body() dto: DeleteBulkSafeWordDto) {
    return this.safeWordService.deleteBulk(dto)
  }

  @UseGuards(AuthGuard(['api-key', 'jwt']))
  @Delete('clear')
  public clear() {
    return this.safeWordService.clear()
  }

  @UseGuards(AuthGuard(['api-key', 'jwt']))
  @Delete(':id')
  public delete(@Param('id') id: number) {
    return this.safeWordService.delete(Number(id))
  }
}
