import { IsString } from 'class-validator'

export class UpdateSafeWordDto {
  @IsString()
  public readonly phrase: string
}
