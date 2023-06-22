import { IsOptional, IsString } from 'class-validator'

export class UpdateApiKeyDto {
  @IsString()
  @IsOptional()
  public readonly comment?: string
}
