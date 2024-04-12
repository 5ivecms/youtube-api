import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateBulkVideoBlacklistDto {
  @IsArray()
  @IsNotEmpty({ each: true })
  @IsString({ each: true })
  public readonly videoIds: string[]

  @IsString()
  @IsOptional()
  public reason: string
}
