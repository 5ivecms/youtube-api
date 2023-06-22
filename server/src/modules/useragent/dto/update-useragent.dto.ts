import { IsString } from 'class-validator'

export class UpdateUseragentDto {
  @IsString()
  public readonly useragent: string
}
