export const SAFE_WORD_CACHE_KEY = 'SAFE_WORD_CACHE'

export const getSafeWordСompositeCacheKey = (id: string | number) => `${SAFE_WORD_CACHE_KEY}-${id}`
