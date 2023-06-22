import type { LogsModel } from './logs'

export interface InvidiousModel {
  id: number
  host: string
  isActive: boolean
  isWorkable: boolean
  useRandomUseragent: boolean
  useProxy: boolean
  logs: LogsModel[]
  pingAvg: number
  pingMax: number
  pingMin: number
  comment?: string
}

export type CreateInvidiousDto = {
  host: string
  comment?: string
}

export interface UpdateInvidiousDto {
  id: number
  host?: string
  isActive?: boolean
  isWorkable?: boolean
  useRandomUseragent?: boolean
  useProxy?: boolean
  comment?: string
}
