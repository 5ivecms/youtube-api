import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '@nestjs/config'
import { CacheModule } from '@nestjs/cache-manager'

import { SettingsEntity } from './settings.entity'
import { SettingsController } from './settings.controller'
import { SettingsService } from './settings.service'
import { SettingsInitService } from './settings-init.service'

@Module({
  imports: [TypeOrmModule.forFeature([SettingsEntity]), ConfigModule, CacheModule.register()],
  controllers: [SettingsController],
  providers: [SettingsService, SettingsInitService],
  exports: [SettingsService],
})
export class SettingsModule {}
