import { registerAs } from '@nestjs/config'

export type SettingsConfig = {
  invidious: {
    proxy: string
    timeout: string
  }
}

export default registerAs('settings', () => ({
  invidious: {
    proxy: process.env.SETTINGS_INVIDIOUS_PROXY || '0',
    timeout: process.env.SETTINGS_INVIDIOUS_TIMEOUT || '2000',
  },
}))
