import { IsNumber } from 'class-validator'

export class DeleteBulkYoutubeApikeysDto {
  @IsNumber({}, { each: true })
  readonly ids: number
}
