import { IsOptional, IsString } from 'class-validator'

export class CreateVideoBlacklistDto {
  @IsString()
  public videoId: string

  @IsString()
  @IsOptional()
  public reason: string
}
