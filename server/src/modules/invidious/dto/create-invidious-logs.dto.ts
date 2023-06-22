import { IsNumber, IsString } from 'class-validator'

export class CreateInvidiousLogsDto {
  @IsNumber()
  public readonly invidiousId: number

  @IsString()
  public readonly message: string
}
