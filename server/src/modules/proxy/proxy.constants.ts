export const PROXIES_CACHE_KEY = 'PROXIES_CACHE'

export const getProxiesСompositeCacheKey = (id: number | string) => `${PROXIES_CACHE_KEY}-${id}`
