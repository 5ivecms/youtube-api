import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { QuotaUsageEntity } from './quota-usage.entity'
import { QuotaUsageController } from './quota-usage.controller'
import { QuotaUsageService } from './quota-usage.service'

@Module({
  imports: [TypeOrmModule.forFeature([QuotaUsageEntity])],
  controllers: [QuotaUsageController],
  exports: [QuotaUsageService],
  providers: [QuotaUsageService],
})
export class QuotaUsageModule {}
