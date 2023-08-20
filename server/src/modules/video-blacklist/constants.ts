export const VIDEO_BLACKLIST_CACHE_KEY = 'VIDEO_BLACKLIST_CACHE'

export const getVideoBlacklistСompositeCacheKey = (key: string | number) => `${VIDEO_BLACKLIST_CACHE_KEY}-${key}`
