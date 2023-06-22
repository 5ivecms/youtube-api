import { IsString } from 'class-validator'

export class GetVideoDto {
  @IsString()
  public readonly youtubeId: string
}
