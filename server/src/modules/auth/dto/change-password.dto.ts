import { IsString } from 'class-validator'

export class ChangePasswordDto {
  @IsString()
  public readonly oldPassword: string

  @IsString()
  public readonly newPassword: string
}
