import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '@nestjs/config'

import { ProxyController } from './proxy.controller'
import { ProxyEntity } from './proxy.entity'
import { ProxyService } from './proxy.service'

@Module({
  imports: [TypeOrmModule.forFeature([ProxyEntity]), ConfigModule],
  controllers: [ProxyController],
  providers: [ProxyService],
  exports: [ProxyService],
})
export class ProxyModule {}
