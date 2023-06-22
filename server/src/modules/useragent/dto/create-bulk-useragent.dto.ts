import { IsArray, IsString, ArrayNotEmpty } from 'class-validator'

export class CreateBulkUseragentDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  public readonly useragents: string[]
}
