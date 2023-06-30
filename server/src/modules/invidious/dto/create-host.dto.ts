import { IsBoolean, IsOptional, IsString } from 'class-validator'

export class CreateHostDto {
  @IsString()
  public readonly host: string

  @IsBoolean()
  @IsOptional()
  public readonly cors?: boolean

  @IsBoolean()
  @IsOptional()
  public readonly api?: boolean

  @IsString()
  @IsOptional()
  public readonly type?: string

  @IsString()
  @IsOptional()
  public readonly comment?: string
}
