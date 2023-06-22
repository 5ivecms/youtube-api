import { IsIn, IsNotEmpty, IsNumberString, IsOptional, IsString } from 'class-validator'
import { VideoDate, VideoSort, VIDEO_DATE_VALUES, VIDEO_SORT_VALUES } from '../invidious.types'

export class SearchVideoDto {
  @IsString()
  @IsNotEmpty()
  public readonly q: string

  @IsString()
  @IsOptional()
  public readonly region?: string

  @IsString()
  @IsOptional()
  @IsIn(Object.keys(VIDEO_DATE_VALUES))
  public readonly date?: VideoDate

  @IsString()
  @IsOptional()
  @IsIn(Object.keys(VIDEO_SORT_VALUES))
  public readonly sort?: VideoSort

  @IsNumberString()
  @IsOptional()
  public readonly page?: number | string
}
