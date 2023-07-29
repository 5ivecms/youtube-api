import { IsString } from 'class-validator'

export class YoutubeApiVideoById {
  @IsString()
  public readonly videoId: string
}
