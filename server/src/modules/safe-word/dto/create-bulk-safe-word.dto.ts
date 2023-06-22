import { IsArray, IsNotEmpty, IsString } from 'class-validator'

export class CreateBulkSafeWordDto {
  @IsArray()
  @IsNotEmpty({ each: true })
  @IsString({ each: true })
  public readonly phrases: string[]
}
