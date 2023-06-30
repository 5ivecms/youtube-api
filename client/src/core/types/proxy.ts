// eslint-disable-next-line no-shadow
export enum ProxyProtocol {
  http = 'http',
  https = 'https',
  socks4 = 'socks4',
  socks5 = 'socks5',
}

export enum ProxyType {
  ipv4 = 'ipv4',
  ipv6 = 'ipv6',
}

export type ProxyProtocolType = keyof typeof ProxyProtocol

export const protocols: ProxyProtocolType[] = ['http', 'https', 'socks4', 'socks5']

export type ProxyTypeType = keyof typeof ProxyType

export const proxyTypes: ProxyTypeType[] = ['ipv4', 'ipv6']

export interface ProxyModel {
  id: number
  ip: string
  isActive: boolean
  login: string
  password: string
  port: number
  protocol: ProxyProtocolType
  type: ProxyTypeType
  comment: string
}

export interface CreateProxyDto {
  ip: string
  login: string
  password: string
  port: number
  protocol: ProxyProtocolType
  type: ProxyTypeType
  comment?: string
}

export interface CreateBulkProxyDto {
  proxies: CreateProxyDto[]
}

export type CreateProxyFormFields = {
  list: string
  protocol: ProxyProtocolType
  type: ProxyTypeType
}

export type UpdateProxyDto = {
  id: number
  ip: string
  isActive: boolean
  login: string
  password: string
  port: number
  protocol: ProxyProtocolType
  type: ProxyTypeType
  comment?: string
}
