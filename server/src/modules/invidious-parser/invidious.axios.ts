import axios from 'axios'
import { HttpsProxyAgent } from 'https-proxy-agent'

import { ProxyEntity } from '../proxy/proxy.entity'

export const createInvidiousAxios = (
  baseURL: string,
  useragent: string = 'asd',
  timeout: number = 5000,
  proxy?: ProxyEntity
) => {
  const headers = { 'Content-Type': 'application/json', referer: '', 'User-agent': useragent }

  const httpsAgent = proxy ? new HttpsProxyAgent(createProxyUri(proxy), { timeout, headers }) : undefined

  const instance = axios.create({
    baseURL,
    timeout,
    httpsAgent,
    headers,
  })

  instance.interceptors.request.use((config) => {
    config.headers['request-startTime'] = new Date().getTime()
    return config
  })

  instance.interceptors.response.use((response) => {
    const currentTime = new Date().getTime()
    const startTime = response.config.headers['request-startTime'] as number
    response.headers['request-duration'] = `${currentTime - startTime}`
    return response
  })

  return instance
}

export const createProxyUri = (proxy: ProxyEntity) => {
  const { ip, port, login, password } = proxy
  let protocol = 'http'

  if (process.env.NODE_ENV === 'prod') {
    protocol = proxy.protocol
  }

  return `${protocol}://${login}:${password}@${ip}:${port}`
}
