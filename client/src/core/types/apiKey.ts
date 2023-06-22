export interface ApiKeyModel {
  id: number
  apiKey: string
  comment: string
  createdAt: Date
  updatedAt: Date
}

export type CreateApiKeyDto = {
  comment: string
}

export interface ApiKeyUpdateDto {
  id: number
  comment?: string
}
