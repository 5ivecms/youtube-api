import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '@nestjs/config'

import { VideoBlacklistEntity } from './video-blacklist.entity'
import { VideoBlacklistController } from './video-blacklist.controller'
import { VideoBlacklistService } from './video-blacklist.service'

@Module({
  imports: [TypeOrmModule.forFeature([VideoBlacklistEntity]), ConfigModule],
  controllers: [VideoBlacklistController],
  exports: [VideoBlacklistService],
  providers: [VideoBlacklistService],
})
export class VideoBlacklistModule {}
