import { IsString } from 'class-validator'

export class AuthDto {
  @IsString()
  public readonly email: string

  @IsString()
  public readonly password: string
}
