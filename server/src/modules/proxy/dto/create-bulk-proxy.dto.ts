import { IsArray, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

import { CreateProxyDto } from './create-proxy.dto'

export class CreateBulkProxyDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProxyDto)
  public readonly proxies: CreateProxyDto[]
}
