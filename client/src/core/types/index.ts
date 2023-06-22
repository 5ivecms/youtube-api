// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ANY = any

export type Tokens = {
  accessToken: string
  refreshToken: string
}

export type LoginFields = {
  login: string
  password: string
}

export interface FindAllResponse<I> {
  items: I[]
  take: number
  page: number
  total: number
}

export type DeleteResponse = {
  affected: number
  raw: number[]
}

export type UpdateResponse = {
  affected: number
  generatedMaps: number[]
  raw: number[]
}
