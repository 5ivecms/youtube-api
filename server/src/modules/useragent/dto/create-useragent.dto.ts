import { IsString } from 'class-validator'

export class CreateUseragentDto {
  @IsString()
  public readonly useragent: string
}
