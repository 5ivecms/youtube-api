import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { YoutubeApikey } from './youtube-apikey.entity'
import { YoutubeApiService } from './youtube-api.service'
import { YoutubeApikeyController } from './youtube-apikey.controller'
import { YoutubeApikeyService } from './youtube-apikey.service'
import { YoutubeApiController } from './youtube-api.controller'

@Module({
  imports: [TypeOrmModule.forFeature([YoutubeApikey])],
  controllers: [YoutubeApikeyController, YoutubeApiController],
  providers: [YoutubeApiService, YoutubeApikeyService],
  exports: [],
})
export class YoutubeModule {}
