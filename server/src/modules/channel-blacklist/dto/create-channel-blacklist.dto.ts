import { IsString } from 'class-validator'

export class CreateChannelBlacklistDto {
  @IsString()
  public channelId: string
}
