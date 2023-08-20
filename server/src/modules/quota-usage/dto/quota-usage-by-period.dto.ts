import { Type } from 'class-transformer'
import { IsDate } from 'class-validator'

export class QuotaUsageByPeriodDto {
  @IsDate()
  @Type(() => Date)
  public readonly startDate: Date

  @IsDate()
  @Type(() => Date)
  public readonly endDate: Date
}
