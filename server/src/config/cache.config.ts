import { registerAs } from '@nestjs/config'

export type CacheConfig = {
  apiKeyCacheTtl: number
  domainsCacheTtl: number
  invidiousCacheTtl: number
  proxyCacheTtl: number
  safeWordsCacheTtl: number
  settingsCacheTtl: number
  useragentsCacheTtl: number
}

export default registerAs('cache', () => ({
  apiKeyCacheTtl: +process.env.API_KEY_CACHE_TTL,
  domainsCacheTtl: +process.env.DOMAINS_CACHE_TTL,
  invidiousCacheTtl: +process.env.INVIDIOUS_CACHE_TTL,
  proxyCacheTtl: +process.env.PROXY_CACHE_TTL,
  safeWordsCacheTtl: +process.env.SAFE_WORDS_CACHE_TTL,
  settingsCacheTtl: +process.env.SETTINGS_CACHE_TTL,
  useragentsCacheTtl: +process.env.USERAGENTS_CACHE_TTL,
}))
