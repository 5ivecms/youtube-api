export enum SettingsEnum {
  INTEGER = 'integer',
  STRING = 'string',
  BOOLEAN = 'boolean',
  TEXT = 'text',
}

export type InvidiousSettings = {
  proxy: boolean
  timeout: number
}
