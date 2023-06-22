import { IsString } from 'class-validator'

export class CreateUserDto {
  @IsString()
  public readonly email: string

  @IsString()
  public readonly password: string
}
