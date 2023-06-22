import { IsNumber } from 'class-validator'

export class DeleteBulkUseragentDto {
  @IsNumber({}, { each: true })
  readonly ids: number
}
