import { IsOptional, IsString } from 'class-validator'

export class CreateApiKeyDto {
  @IsString()
  @IsOptional()
  public readonly comment?: string
}
