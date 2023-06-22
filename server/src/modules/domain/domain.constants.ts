export const DOMAINS_CACHE_KEY = 'DOMAINS_CACHE'

export const getDomainByIdCacheKey = (id: number) => `${DOMAINS_CACHE_KEY}-${id}`
