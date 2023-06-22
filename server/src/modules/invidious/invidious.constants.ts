export const INVIDIOUS_CACHE_KEY = 'INVIDIOUS_CACHE'

export const getInvidiousСompositeCacheKey = (postfix: number | string) => {
  return `${INVIDIOUS_CACHE_KEY}-${postfix}`
}
