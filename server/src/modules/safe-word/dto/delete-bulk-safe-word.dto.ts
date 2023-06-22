import { IsArray, IsNotEmpty, IsNumber } from 'class-validator'

export class DeleteBulkSafeWordDto {
  @IsArray()
  @IsNotEmpty({ each: true })
  @IsNumber({}, { each: true })
  public readonly ids: number[]
}
