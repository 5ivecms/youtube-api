export interface UseragentModel {
  id: number
  useragent: string
}

export interface CreateBulkUseragentDto {
  useragents: string[]
}

export interface UseragentSearch {
  id?: number
  useragent?: string
}

export interface UseragentUpdateDto {
  id: number
  useragent?: string
}
