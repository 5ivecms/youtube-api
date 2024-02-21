export const CHANNEL_BLACKLIST_CACHE_KEY = 'CHANNEL_BLACKLIST_CACHE'

export const getChannelBlacklistСompositeCacheKey = (key: string | number) => `${CHANNEL_BLACKLIST_CACHE_KEY}-${key}`
