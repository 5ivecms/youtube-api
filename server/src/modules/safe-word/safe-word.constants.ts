export const SAFE_WORD_CACHE_KEY = 'SAFE_WORD_CACHE'

export const getSafeWordСompositeCacheKey = (id: string | number) => {
  return `${SAFE_WORD_CACHE_KEY}-${id}`
}
