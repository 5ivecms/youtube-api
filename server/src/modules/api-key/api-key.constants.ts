export const API_KEY_CACHE_KEY = 'API_KEY_CACHE'

export const getApiKeyСompositeCacheKey = (id: string | number) => {
  return `${API_KEY_CACHE_KEY}-${id}`
}
