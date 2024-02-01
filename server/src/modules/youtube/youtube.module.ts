import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { YoutubeApikey } from './youtube-apikey.entity'
import { YoutubeApiService } from './youtube-api.service'
import { YoutubeApikeyController } from './youtube-apikey.controller'
import { YoutubeApikeyService } from './youtube-apikey.service'
import { YoutubeApiController } from './youtube-api.controller'
import { VideoBlacklistModule } from '../video-blacklist/video-blacklist.module'
import { SafeWordModule } from '../safe-word/safe-word.module'
import { QuotaUsageModule } from '../quota-usage/quota-usage.module'
import { ProxyModule } from '../proxy/proxy.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([YoutubeApikey]),
    VideoBlacklistModule,
    SafeWordModule,
    QuotaUsageModule,
    ProxyModule,
  ],
  controllers: [YoutubeApikeyController, YoutubeApiController],
  providers: [YoutubeApiService, YoutubeApikeyService],
  exports: [YoutubeApikeyService],
})
export class YoutubeModule {}
