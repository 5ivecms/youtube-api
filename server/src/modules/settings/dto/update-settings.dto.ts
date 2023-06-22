import { IsEnum, IsNumberString, IsOptional, IsString } from 'class-validator'
import { SettingsEnum } from '../settings.types'

export class UpdateSettingsDto {
  @IsNumberString()
  @IsOptional()
  public readonly id?: number

  @IsString()
  @IsOptional()
  public readonly name?: string

  @IsString()
  @IsOptional()
  public readonly section?: string

  @IsString()
  @IsOptional()
  public readonly label?: string

  @IsEnum(SettingsEnum)
  @IsOptional()
  public readonly type?: SettingsEnum
}
