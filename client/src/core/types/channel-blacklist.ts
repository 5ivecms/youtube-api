export type ChannelBlacklistModel = {
  id: number
  channelId: string
}

export type CreateChannelBlacklistsDto = {
  channelIds: string[]
}

export type ChannelBlacklistUpdateDto = {
  channelId?: string
}

export type CreateChannelBlacklistFields = {
  list: string
}
