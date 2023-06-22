import { IsOptional, IsString } from 'class-validator'

export class CreateHostDto {
  @IsString()
  public readonly host: string

  @IsString()
  @IsOptional()
  public readonly comment?: string
}
