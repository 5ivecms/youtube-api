import { IsString } from 'class-validator'

export class YoutubeApiVideoByPlaylistId {
  @IsString()
  public readonly playlistId: string
}
