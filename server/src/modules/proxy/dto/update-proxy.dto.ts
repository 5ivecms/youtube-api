import { IsString, IsBoolean, IsOptional, IsEnum, IsNumber } from 'class-validator'

import { ProxyProtocol } from '../proxy.types'

export class UpdateProxyDto {
  @IsEnum(ProxyProtocol)
  @IsOptional()
  public readonly protocol?: ProxyProtocol

  @IsString()
  @IsOptional()
  public readonly ip?: string

  @IsNumber()
  @IsOptional()
  public readonly port?: number

  @IsBoolean()
  @IsOptional()
  public readonly isActive?: boolean

  @IsString()
  @IsOptional()
  public readonly comment?: string
}
