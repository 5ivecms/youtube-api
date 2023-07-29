import { ArrayNotEmpty, IsArray, IsNumber, IsOptional, IsString } from 'class-validator'

export class CreateBulkYoutubeApikeyDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  public readonly apikeys: string[]

  @IsNumber()
  @IsOptional()
  public readonly dailyLimit?: number

  @IsString()
  @IsOptional()
  public readonly comment?: string
}
