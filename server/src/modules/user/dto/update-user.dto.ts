import { IsOptional, IsString } from 'class-validator'

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  public readonly email?: string

  @IsString()
  @IsOptional()
  public readonly password?: string

  @IsString()
  @IsOptional()
  public readonly refreshToken?: string | null
}
