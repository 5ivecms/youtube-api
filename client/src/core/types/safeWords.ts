export interface SafeWordModel {
  id: number
  phrase: string
}

export interface CreateSafeWordsDto {
  phrases: string[]
}

export interface SafeWorUpdateDto {
  id: number
  phrase?: string
}
