import { IsOptional, IsString } from 'class-validator'

export class CreateChannelBlacklistDto {
  @IsString()
  public channelId: string

  @IsString()
  @IsOptional()
  public reason: string
}
