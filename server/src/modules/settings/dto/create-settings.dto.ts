import { IsEnum, IsString } from 'class-validator'

import { SettingsEnum } from '../settings.types'

export class CreateSettingsDto {
  @IsString()
  public readonly option: string

  @IsString()
  public readonly section: string

  @IsString()
  public readonly value: string

  @IsString()
  public readonly label: string

  @IsEnum(SettingsEnum)
  public readonly type: SettingsEnum
}
