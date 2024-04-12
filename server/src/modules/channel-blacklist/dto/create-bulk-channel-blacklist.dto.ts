import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateBulkChannelBlacklistDto {
  @IsArray()
  @IsNotEmpty({ each: true })
  @IsString({ each: true })
  public readonly channelIds: string[]

  @IsString()
  @IsOptional()
  public reason: string
}
