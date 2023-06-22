import { SettingsEntity } from './settings.entity'
import { SettingsEnum } from './settings.types'

export const invidiousBaseSettings: Omit<SettingsEntity, 'id'>[] = [
  {
    option: 'proxy',
    section: 'invidious',
    type: SettingsEnum.BOOLEAN,
    value: '0',
    label: 'Использовать прокси',
  },
  {
    option: 'timeout',
    section: 'invidious',
    type: SettingsEnum.INTEGER,
    value: '2000',
    label: 'Таймаут хоста',
  },
]

export const SETTINGS_CACHE_KEY = 'SETTINGS_CACHE'
