export const DEFAULT_USERAGENT = '123'

export const INVIDIOUS_SITE_URL = {
  video: (id: string): string => `/watch?v=${id}`,
  trends: (): string => `/feed/trending`,
  popular: (): string => `/feed/popular`,
  search: (): string => `/search`,
}

export const INVIDIOUS_API_URL = {
  video: (id: string): string =>
    `/api/v1/videos/${id}?fields=videoId,title,description,viewCount,likeCount,recommendedVideos/videoId,recommendedVideos/title,recommendedVideos/viewCount,recommendedVideos/lengthSeconds&pretty=1`,
  trends: (): string => `/api/v1/trending`,
  popular: (): string => `/api/v1/popular`,
  search: (): string => `/api/v1/search`,
}
