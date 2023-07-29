import { IsNumber, IsOptional, IsString } from 'class-validator'

export class CreateYoutubeApikeyDto {
  @IsString()
  public readonly apikey: string

  @IsNumber()
  @IsOptional()
  public readonly dailyLimit?: number

  @IsString()
  @IsOptional()
  public readonly comment?: string
}
