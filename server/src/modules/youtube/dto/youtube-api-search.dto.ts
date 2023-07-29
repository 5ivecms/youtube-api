import { IsString } from 'class-validator'

export class YoutubeApiSearchDto {
  @IsString()
  public readonly q: string
}
