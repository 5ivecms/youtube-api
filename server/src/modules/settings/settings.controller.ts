import { UseGuards, Body, Controller, Delete, Get, Param, Post, UseInterceptors, Patch } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

import { SettingsService } from './settings.service'
import { SettingsResponseInterceptor } from './settings.-response.interceptor'
import { CreateSettingsDto, UpdateBulkSettings, UpdateSettingsDto } from './dto'

@UseInterceptors(SettingsResponseInterceptor)
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @UseGuards(AuthGuard(['jwt']))
  @Get()
  public findAll() {
    return this.settingsService.findAll()
  }

  @UseGuards(AuthGuard(['jwt']))
  @Get('invidious-settings')
  public getInvidiousSettings() {
    return this.settingsService.getInvidiousSettings()
  }

  @UseGuards(AuthGuard(['jwt']))
  @Post('reset-cache')
  public resetCache() {
    return this.settingsService.resetCache()
  }

  @UseGuards(AuthGuard(['jwt']))
  @Post()
  public create(@Body() dto: CreateSettingsDto) {
    return this.settingsService.create(dto)
  }

  @UseGuards(AuthGuard(['jwt']))
  @Patch('update-bulk')
  public updateBulk(@Body() dto: UpdateBulkSettings) {
    return this.settingsService.updateBulk(dto)
  }

  @UseGuards(AuthGuard(['jwt']))
  @Patch(':id')
  public update(@Param('id') id: number, @Body() dto: UpdateSettingsDto) {
    return this.settingsService.update(Number(id), dto)
  }

  @UseGuards(AuthGuard(['jwt']))
  @Delete(':id')
  public delete(@Param('id') id: number) {
    return this.settingsService.delete(Number(id))
  }
}
