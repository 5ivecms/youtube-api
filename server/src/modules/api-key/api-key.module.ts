import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ApiKeyEntity } from './api-key.entity'
import { ApiKeyController } from './api-key.controller'
import { ApiKeyService } from './api-key.service'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [TypeOrmModule.forFeature([ApiKeyEntity]), ConfigModule],
  controllers: [ApiKeyController],
  providers: [ApiKeyService],
  exports: [ApiKeyService],
})
export class ApiKeyModule {}
