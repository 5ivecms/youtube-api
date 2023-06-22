import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CacheModule } from '@nestjs/cache-manager'
import { ConfigModule } from '@nestjs/config'

import { SafeWordEntity } from './safe-word.entity'
import { SafeWordController } from './safe-word.controller'
import { SafeWordService } from './safe-word.service'

@Module({
  imports: [TypeOrmModule.forFeature([SafeWordEntity]), CacheModule.register(), ConfigModule],
  controllers: [SafeWordController],
  providers: [SafeWordService],
  exports: [SafeWordService],
})
export class SafeWordModule {}
