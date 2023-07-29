import { IsString } from 'class-validator'

export class YoutubeApiVideoByCategoryIdDto {
  @IsString()
  public readonly categoryId: string
}
