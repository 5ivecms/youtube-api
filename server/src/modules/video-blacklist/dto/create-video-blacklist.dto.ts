import { IsString } from 'class-validator'

export class CreateVideoBlacklistDto {
  @IsString()
  public videoId: string
}
