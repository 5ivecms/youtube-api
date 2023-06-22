import { IsNumber } from 'class-validator'

export class DeleteBulkDomainDto {
  @IsNumber({}, { each: true })
  readonly ids: number
}
