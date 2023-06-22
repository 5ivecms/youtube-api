import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CacheModule } from '@nestjs/cache-manager'
import { ConfigModule } from '@nestjs/config'

import { ProxyController } from './proxy.controller'
import { ProxyEntity } from './proxy.entity'
import { ProxyService } from './proxy.service'

@Module({
  imports: [TypeOrmModule.forFeature([ProxyEntity]), CacheModule.register(), ConfigModule],
  controllers: [ProxyController],
  providers: [ProxyService],
  exports: [ProxyService],
})
export class ProxyModule {}
