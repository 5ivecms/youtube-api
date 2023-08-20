import { IsString } from 'class-validator'

export class UpdateVideoBlacklistDto {
  @IsString()
  public readonly videoId: string
}
