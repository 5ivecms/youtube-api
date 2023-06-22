import { ValidateNested } from 'class-validator'
import { UpdateSettingsDto } from './update-settings.dto'
import { Type } from 'class-transformer'

export class UpdateBulkSettings {
  @ValidateNested()
  @Type(() => UpdateSettingsDto)
  public readonly settings: UpdateSettingsDto[]
}
