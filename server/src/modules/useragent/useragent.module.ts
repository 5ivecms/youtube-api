import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CacheModule } from '@nestjs/cache-manager'
import { ConfigModule } from '@nestjs/config'

import { UseragentController } from './useragent.controller'
import { UseragentEntity } from './useragent.entity'
import { UseragentService } from './useragent.service'

@Module({
  imports: [TypeOrmModule.forFeature([UseragentEntity]), CacheModule.register(), ConfigModule],
  controllers: [UseragentController],
  providers: [UseragentService],
  exports: [UseragentService],
})
export class UseragentModule {}
