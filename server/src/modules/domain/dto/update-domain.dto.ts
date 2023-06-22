import { IsString } from 'class-validator'

export class UpdateDomainDto {
  @IsString()
  public domain: string
}
