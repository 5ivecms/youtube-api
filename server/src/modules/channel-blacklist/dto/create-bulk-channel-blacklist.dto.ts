import { IsArray, IsNotEmpty, IsString } from 'class-validator'

export class CreateBulkChannelBlacklistDto {
  @IsArray()
  @IsNotEmpty({ each: true })
  @IsString({ each: true })
  public readonly channelIds: string[]
}
