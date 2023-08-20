import { Body, Controller, Get, Post, Query } from '@nestjs/common'

import { QuotaUsageService } from './quota-usage.service'
import { CreateOrUpdateQuotaUsageDto, QuotaUsageByPeriodDto } from './dto'

@Controller('quota-usage')
export class QuotaUsageController {
  constructor(private readonly quotaUsageService: QuotaUsageService) {}

  @Get()
  public findAll() {
    return this.quotaUsageService.findAll()
  }

  @Get('by-period')
  public byPeriod(@Query() dto: QuotaUsageByPeriodDto) {
    return this.quotaUsageService.byPeriod(dto)
  }

  @Post('add-usage')
  public addUsage(@Body() dto: CreateOrUpdateQuotaUsageDto) {
    return this.quotaUsageService.addUsage(dto)
  }

  @Post('fill-db')
  public fillDb() {
    return this.quotaUsageService.fillDb()
  }
}
