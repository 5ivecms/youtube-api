import { Injectable } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'

import { QuotaUsageService } from '../quota-usage/quota-usage.service'
import { YoutubeApikeyService } from '../youtube/youtube-apikey.service'

@Injectable()
export class CronService {
  constructor(
    private readonly quotaUsageService: QuotaUsageService,
    private readonly youtubeApikeyService: YoutubeApikeyService
  ) {}

  @Cron('0 11 * * *', { timeZone: 'Europe/Moscow' })
  public async handleCron() {
    await this.quotaUsageService.addUsage({ currentUsage: 0 })
  }

  @Cron('0 11 * * *', { timeZone: 'Europe/Moscow' })
  public async resetCurrentUsage() {
    await this.youtubeApikeyService.resetAllKeys()
  }
}
