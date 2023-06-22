import { IsString, IsBoolean, IsOptional } from 'class-validator'

export class UpdateHostDto {
  @IsString()
  @IsOptional()
  public readonly host?: string

  @IsBoolean()
  @IsOptional()
  public readonly isActive?: boolean

  @IsBoolean()
  @IsOptional()
  public readonly isWorkable?: boolean

  @IsBoolean()
  @IsOptional()
  public readonly useRandomUseragent?: boolean

  @IsBoolean()
  @IsOptional()
  public readonly useProxy?: boolean

  @IsString()
  @IsOptional()
  public readonly comment?: string
}
