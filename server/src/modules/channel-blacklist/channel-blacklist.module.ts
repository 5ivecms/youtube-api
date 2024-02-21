import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ChannelBlacklistEntity } from './channel-blacklist.entity'
import { ChannelBlacklistController } from './channel-blacklist.controller'
import { ChannelBlacklistService } from './channel-blacklist.service'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [TypeOrmModule.forFeature([ChannelBlacklistEntity]), ConfigModule],
  controllers: [ChannelBlacklistController],
  providers: [ChannelBlacklistService],
  exports: [ChannelBlacklistService],
})
export class ChannelBlacklistModule {}
