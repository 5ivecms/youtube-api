export const MAX_QUOTA = 9500

const BASE_URL = 'https://www.googleapis.com/youtube/v3'

export const YTApiEndpoints = {
  search: `${BASE_URL}/search`,
  videoCategories: `${BASE_URL}/videoCategories`,
  videoById: `${BASE_URL}/videos`,
  videoByCategoryId: `${BASE_URL}/videos`,
  trends: `${BASE_URL}/videos`,
  channels: `${BASE_URL}/channels`,
  playlistItems: `${BASE_URL}/playlistItems`,
  commentThreads: `${BASE_URL}/commentThreads`,
}

export enum QuotaCosts {
  SEARCH_LIST = 100,
  VIDEO_CATEGORIES_LIST = 1,
  VIDEO_LIST = 1,
  CHANNELS_LIST = 1,
  PLAYLIST_ITEMS_LIST = 1,
  COMMENTS_THREADS_LIST = 1,
}

export const AVAILABLE_CATEGORY_IDS = [1, 2, 10, 15, 17, 20, 22, 23, 24, 25, 26, 28]
