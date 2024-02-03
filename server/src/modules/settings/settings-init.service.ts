import { Injectable, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { SettingsService } from './settings.service'
import {
  apiKeysBaseSettings,
  appBaseSettings,
  invidiousBaseSettings,
  parserBaseSettings,
  youtubeCacheBaseSettings,
} from './settings.constants'
import { SettingsConfig } from '../../config/settings.config'

@Injectable()
export class SettingsInitService implements OnModuleInit {
  constructor(private readonly settingsService: SettingsService, private readonly configService: ConfigService) {}

  public async onModuleInit() {
    const settingsConfig = this.configService.get<SettingsConfig>('settings')

    for (const settings of invidiousBaseSettings) {
      const existSetting = await this.settingsService.findOne({ option: settings.option, section: settings.section })
      if (!existSetting) {
        await this.settingsService.create({
          ...settings,
          value: settingsConfig[settings.section][settings.option] ?? settings.value,
        })
      }
    }

    for (const settings of appBaseSettings) {
      const existSetting = await this.settingsService.findOne({ option: settings.option, section: settings.section })
      if (!existSetting) {
        await this.settingsService.create({
          ...settings,
          value: settingsConfig[settings.section][settings.option] ?? settings.value,
        })
      }
    }

    for (const settings of apiKeysBaseSettings) {
      const existSetting = await this.settingsService.findOne({ option: settings.option, section: settings.section })
      if (!existSetting) {
        await this.settingsService.create({
          ...settings,
          value: settingsConfig[settings.section][settings.option] ?? settings.value,
        })
      }
    }

    for (const settings of youtubeCacheBaseSettings) {
      const existSetting = await this.settingsService.findOne({ option: settings.option, section: settings.section })
      if (!existSetting) {
        await this.settingsService.create({
          ...settings,
          value: settingsConfig[settings.section][settings.option] ?? settings.value,
        })
      }
    }

    for (const settings of parserBaseSettings) {
      const existSetting = await this.settingsService.findOne({ option: settings.option, section: settings.section })
      if (!existSetting) {
        await this.settingsService.create({
          ...settings,
          value: settingsConfig[settings.section][settings.option] ?? settings.value,
        })
      }
    }
  }
}
