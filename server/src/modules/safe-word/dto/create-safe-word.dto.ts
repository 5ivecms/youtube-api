import { IsString } from 'class-validator'

export class CreateSafeWordDto {
  @IsString()
  public readonly phrase: string
}
