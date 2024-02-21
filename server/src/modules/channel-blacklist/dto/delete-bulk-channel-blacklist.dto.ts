import { IsArray, IsNotEmpty, IsNumber } from 'class-validator'

export class DeleteBulkChannelBlacklistDto {
  @IsArray()
  @IsNotEmpty({ each: true })
  @IsNumber({}, { each: true })
  public readonly channelIds: number[]
}
