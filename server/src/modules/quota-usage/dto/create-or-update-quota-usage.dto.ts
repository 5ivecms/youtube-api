import { IsNumber } from 'class-validator'

export class CreateOrUpdateQuotaUsageDto {
  @IsNumber()
  public readonly currentUsage: number
}
