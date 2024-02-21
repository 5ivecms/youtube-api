import { IsString } from 'class-validator'

export class UpdateChannelBlacklistDto {
  @IsString()
  public readonly channelId: string
}
