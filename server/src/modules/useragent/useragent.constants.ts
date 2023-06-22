export const USERAGENT_CACHE_KEY = 'USERAGENT_CACHE'

export const getUseragentByIdCacheKey = (id: string | number) => {
  return `${USERAGENT_CACHE_KEY}-${id}`
}
