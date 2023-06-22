import { IsString } from 'class-validator'

export class GetVideoByIdDto {
  @IsString()
  public readonly id: string
}
