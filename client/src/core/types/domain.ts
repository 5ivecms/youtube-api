import { ApiKeyModel } from './apiKey'

export interface DomainModel {
  id: number
  domain: string
  apiKey: ApiKeyModel
}

export type CreateDomainDto = {
  domain: string
}

export type UpdateDomainDto = {
  id: number
  domain: string
}
