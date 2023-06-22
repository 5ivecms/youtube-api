// eslint-disable-next-line no-shadow
export enum ProxyProtocol {
  http = 'http',
  https = 'https',
  socks4 = 'socks4',
  socks5 = 'socks5',
}

export type ProxyProtocolType = keyof typeof ProxyProtocol

export const protocols: ProxyProtocolType[] = ['http', 'https', 'socks4', 'socks5']

export interface ProxyModel {
  id: number
  ip: string
  isActive: boolean
  login: string
  password: string
  port: number
  protocol: string
  comment: string
}

export interface CreateProxyDto {
  ip: string
  login: string
  password: string
  port: number
  protocol: string
  comment?: string
}

export interface CreateBulkProxyDto {
  proxies: CreateProxyDto[]
}

export type CreateProxyFormFields = {
  list: string
  protocol: string
}

export type UpdateProxyDto = {
  id: number
  ip: string
  isActive: boolean
  login: string
  password: string
  port: number
  protocol: string
  comment?: string
}
