export enum SettingsEnum {
  BOOLEAN = 'boolean',
  INTEGER = 'integer',
  STRING = 'string',
  TEXT = 'text',
}

type SettingsBase = {
  id: number
  label: string
  option: string
  section: string
}

type SettingsBoolean = SettingsBase & {
  type: SettingsEnum.BOOLEAN
  value: boolean
}

type SettingsString = SettingsBase & {
  type: SettingsEnum.STRING
  value: string
}

type SettingsText = SettingsBase & {
  type: SettingsEnum.TEXT
  value: string
}

type SettingsInteger = SettingsBase & {
  type: SettingsEnum.INTEGER
  value: number
}

export type SettingsModel = SettingsBoolean | SettingsInteger | SettingsString | SettingsText

export type UpdateSettingDto = {
  id: string
  label: string
  option: string
  section: string
  type: string
  value: string
}
