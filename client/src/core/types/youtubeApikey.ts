export interface YoutubeApikeyModel {
  apikey: string
  id: number
  currentUsage: number
  dailyLimit: number
  error: string
  isActive: boolean
  comment: string
}

export type CreateYoutubeApikeyDto = {
  apikey: string
  dailyLimit?: number
  comment?: string
}

export type CreateBulkYoutubeApikeyDto = {
  apikeys: string[]
  dailyLimit?: number
  comment?: string
}

export interface YoutubeApikeyUpdateDto {
  id: number
  apikey?: string
  dailyLimit?: number
  comment?: string
  currentUsage?: number
}
