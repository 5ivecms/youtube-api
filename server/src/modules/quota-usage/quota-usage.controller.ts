import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common'

import { QuotaUsageService } from './quota-usage.service'
import { CreateOrUpdateQuotaUsageDto, QuotaUsageByPeriodDto } from './dto'
import { AuthGuard } from '@nestjs/passport'

@Controller('quota-usage')
export class QuotaUsageController {
  constructor(private readonly quotaUsageService: QuotaUsageService) {}

  @UseGuards(AuthGuard(['api-key', 'jwt']))
  @Get()
  public findAll() {
    return this.quotaUsageService.findAll()
  }

  @UseGuards(AuthGuard(['api-key', 'jwt']))
  @Get('by-period')
  public byPeriod(@Query() dto: QuotaUsageByPeriodDto) {
    return this.quotaUsageService.byPeriod(dto)
  }

  @UseGuards(AuthGuard(['api-key', 'jwt']))
  @Get('today')
  public todayUsage() {
    return this.quotaUsageService.todayUsage()
  }

  @UseGuards(AuthGuard(['api-key', 'jwt']))
  @Post('add-usage')
  public addUsage(@Body() dto: CreateOrUpdateQuotaUsageDto) {
    return this.quotaUsageService.addUsage(dto)
  }

  @UseGuards(AuthGuard(['api-key', 'jwt']))
  @Post('fill-db')
  public fillDb() {
    return this.quotaUsageService.fillDb()
  }
}
