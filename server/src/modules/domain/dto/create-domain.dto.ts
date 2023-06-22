import { IsString } from 'class-validator'

export class CreateDomainDto {
  @IsString()
  public domain: string
}
