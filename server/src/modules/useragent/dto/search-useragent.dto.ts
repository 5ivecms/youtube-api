import { IsNumberString, IsObject, IsOptional, IsString } from 'class-validator'
import { UseragentEntity } from '../useragent.entity'

export class SearchUseragentDto {
  @IsOptional()
  @IsNumberString()
  public readonly page: number

  @IsOptional()
  @IsNumberString()
  public readonly limit: number

  @IsOptional()
  @IsString()
  public readonly order: string

  @IsOptional()
  @IsString()
  public readonly orderBy: string

  @IsObject()
  @IsOptional()
  public readonly search: Partial<UseragentEntity>
}
