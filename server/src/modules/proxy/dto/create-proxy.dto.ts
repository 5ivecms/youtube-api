import { IsString, IsBoolean, IsEnum, IsNumber, IsOptional } from 'class-validator'

import { ProxyProtocol } from '../proxy.types'

export class CreateProxyDto {
  @IsString()
  @IsEnum(ProxyProtocol)
  public readonly protocol: ProxyProtocol

  @IsString()
  public readonly ip: string

  @IsNumber()
  public readonly port: number

  @IsString()
  public readonly login: string

  @IsString()
  public readonly password: string

  @IsBoolean()
  @IsOptional()
  public readonly isActive?: boolean

  @IsString()
  @IsOptional()
  public readonly comment?: string
}
