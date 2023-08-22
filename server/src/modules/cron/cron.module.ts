import { Module } from '@nestjs/common'

import { QuotaUsageModule } from '../quota-usage/quota-usage.module'
import { CronService } from './cron.service'
import { YoutubeModule } from '../youtube/youtube.module'

@Module({
  imports: [QuotaUsageModule, YoutubeModule],
  exports: [CronService],
  providers: [CronService],
})
export class CronModule {}
