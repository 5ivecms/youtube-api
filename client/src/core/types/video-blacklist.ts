export type VideoBlacklistModel = {
  id: number
  videoId: string
  reason: string
  createdAt: Date
}

export type CreateVideoBlacklistsDto = {
  videoIds: string[]
}

export type VideoBlacklistUpdateDto = {
  videoId?: string
}

export type CreateVideoBlacklistFields = {
  list: string
}
