import { IsString } from 'class-validator'

export class YoutubeApiVideoByChannelIdDto {
  @IsString()
  public readonly channelId: string
}
