import { IsArray, IsNotEmpty, IsString } from 'class-validator'

export class CreateBulkVideoBlacklistDto {
  @IsArray()
  @IsNotEmpty({ each: true })
  @IsString({ each: true })
  public readonly videoIds: string[]
}
