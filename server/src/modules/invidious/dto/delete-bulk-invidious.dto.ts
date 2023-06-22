import { IsNumber } from 'class-validator'

export class DeleteBulkInvidiousDto {
  @IsNumber({}, { each: true })
  readonly ids: number
}
