import {
  UseGuards,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  BadRequestException,
  Patch,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

import { SearchDto } from '../../common/services/search-service/search.dto'
import { CreateBulkUseragentDto, CreateUseragentDto, DeleteBulkUseragentDto, UpdateUseragentDto } from './dto'
import { UseragentEntity } from './useragent.entity'
import { UseragentService } from './useragent.service'

@Controller('useragents')
export class UseragentController {
  constructor(private readonly useragentService: UseragentService) {}

  @UseGuards(AuthGuard(['jwt']))
  @Get()
  public findAll() {
    return this.useragentService.findAll()
  }

  @UseGuards(AuthGuard(['jwt']))
  @Get('random-useragent')
  public getRandomUseragent() {
    return this.useragentService.getRandomUseragent()
  }

  @UseGuards(AuthGuard(['jwt']))
  @Get('search')
  public search(@Query() dto: SearchDto<UseragentEntity>) {
    return this.useragentService.search(dto)
  }

  @UseGuards(AuthGuard(['jwt']))
  @Get(':id')
  public findOne(@Param('id') id: number) {
    const paramId = Number(id)

    if (!paramId) {
      throw new BadRequestException('Неверный параметр')
    }

    return this.useragentService.findOne(paramId)
  }

  @UseGuards(AuthGuard(['jwt']))
  @Post()
  public create(@Body() dto: CreateUseragentDto) {
    return this.useragentService.create(dto)
  }

  @UseGuards(AuthGuard(['jwt']))
  @Post('create-bulk')
  public createBulk(@Body() dto: CreateBulkUseragentDto) {
    return this.useragentService.createBulk(dto)
  }

  @UseGuards(AuthGuard(['jwt']))
  @Patch(':id')
  public update(@Body() dto: UpdateUseragentDto, @Param('id') id: number) {
    return this.useragentService.update(+id, dto)
  }

  @UseGuards(AuthGuard(['jwt']))
  @Delete('delete-bulk')
  public deleteBulk(@Body() dto: DeleteBulkUseragentDto) {
    return this.useragentService.deleteBulk(dto)
  }

  @UseGuards(AuthGuard(['jwt']))
  @Delete('clear')
  public clear() {
    return this.useragentService.clear()
  }

  @UseGuards(AuthGuard(['jwt']))
  @Delete(':id')
  public delete(@Param('id') id: number) {
    return this.useragentService.delete(+id)
  }
}
