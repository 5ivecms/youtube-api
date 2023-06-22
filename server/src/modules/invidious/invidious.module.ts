import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CacheModule } from '@nestjs/cache-manager'
import { ConfigModule } from '@nestjs/config'

import { InvidiousController } from './invidious.controller'
import { InvidiousEntity } from './invidious.entity'
import { InvidiousService } from './invidious.service'
import { InvidiousLogsEntity } from './invidious-logs.entity'
import { InvidiousLogsService } from './invidious-logs.service'

@Module({
  imports: [TypeOrmModule.forFeature([InvidiousEntity, InvidiousLogsEntity]), CacheModule.register(), ConfigModule],
  controllers: [InvidiousController],
  exports: [InvidiousService, InvidiousLogsService],
  providers: [InvidiousService, InvidiousLogsService],
})
export class InvidiousModule {}
