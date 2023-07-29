import { IsString } from 'class-validator'

export class YoutubeApiCommentsDto {
  @IsString()
  public videoId: string
}
