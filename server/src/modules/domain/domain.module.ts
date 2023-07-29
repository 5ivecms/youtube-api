import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '@nestjs/config'

import { DomainEntity } from './domain.entity'
import { DomainService } from './domain.service'
import { DomainController } from './domain.controller'
import { ApiKeyModule } from '../api-key/api-key.module'

@Module({
  imports: [TypeOrmModule.forFeature([DomainEntity]), ApiKeyModule, ConfigModule],
  controllers: [DomainController],
  providers: [DomainService],
  exports: [DomainService],
})
export class DomainModule {}
