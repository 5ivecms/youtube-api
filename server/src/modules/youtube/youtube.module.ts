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
import { SettingsModule } from '../settings/settings.module'
import { ChannelBlacklistModule } from '../channel-blacklist/channel-blacklist.module'
import { Cld3Module } from '../cld3/cld3.module'
import { YoutubeCacheProvider } from './youtube-cache.provider'
import { YoutubeFilterProvider } from './youtube-filter.provider'

@Module({
  imports: [
    TypeOrmModule.forFeature([YoutubeApikey]),
    VideoBlacklistModule,
    ChannelBlacklistModule,
    SafeWordModule,
    QuotaUsageModule,
    ProxyModule,
    SettingsModule,
    Cld3Module,
  ],
  controllers: [YoutubeApikeyController, YoutubeApiController],
  providers: [YoutubeApiService, YoutubeApikeyService, YoutubeCacheProvider, YoutubeFilterProvider],
  exports: [YoutubeApikeyService, YoutubeCacheProvider, YoutubeFilterProvider],
})
export class YoutubeModule {}
