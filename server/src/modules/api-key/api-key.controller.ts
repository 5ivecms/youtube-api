import { UseGuards, Patch, Body, Query, Controller, Get, Param, Delete, Post } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

import { ApiKeyService } from './api-key.service'
import { SearchDto } from '../../common/services/search-service/search.dto'
import { ApiKeyEntity } from './api-key.entity'
import { CreateApiKeyDto, DeleteBulkApiKeysDto, UpdateApiKeyDto } from './dto'

@Controller('api-key')
export class ApiKeyController {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  @UseGuards(AuthGuard(['jwt']))
  @Get()
  public findAll() {
    return this.apiKeyService.findAll()
  }

  @UseGuards(AuthGuard(['jwt']))
  @Get('search')
  public search(@Query() dto: SearchDto<ApiKeyEntity>) {
    return this.apiKeyService.search(dto)
  }

  @UseGuards(AuthGuard(['jwt']))
  @Get(':id')
  public findOne(@Param('id') id: number) {
    return this.apiKeyService.findOne(Number(id))
  }

  @UseGuards(AuthGuard(['jwt']))
  @Post()
  public create(@Body() dto: CreateApiKeyDto) {
    return this.apiKeyService.create(dto)
  }

  @UseGuards(AuthGuard(['jwt']))
  @Patch(':id')
  public update(@Body() dto: UpdateApiKeyDto, @Param('id') id: number) {
    return this.apiKeyService.update(+id, dto)
  }

  @UseGuards(AuthGuard(['jwt']))
  @Post('generate')
  public generateApiKey() {
    return this.apiKeyService.generateApiKey()
  }

  @UseGuards(AuthGuard(['jwt']))
  @Delete('delete-bulk')
  public deleteBulk(@Body() dto: DeleteBulkApiKeysDto) {
    return this.apiKeyService.deleteBulk(dto)
  }

  @UseGuards(AuthGuard(['jwt']))
  @Delete(':id')
  public delete(@Param('id') id: number) {
    return this.apiKeyService.delete(Number(id))
  }
}
