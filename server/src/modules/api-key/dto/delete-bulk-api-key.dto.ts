import { IsNumber } from 'class-validator'

export class DeleteBulkApiKeysDto {
  @IsNumber({}, { each: true })
  readonly ids: number
}
