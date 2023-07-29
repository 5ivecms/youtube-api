import { IsNumber, IsOptional, IsString } from 'class-validator'

export class UpdateYoutubeApikeyDto {
  @IsString()
  @IsOptional()
  public readonly apikey?: string

  @IsString()
  @IsOptional()
  public readonly comment?: string

  @IsNumber()
  @IsOptional()
  public readonly dailyLimit?: number

  @IsNumber()
  @IsOptional()
  public readonly currentUsage?: number
}
