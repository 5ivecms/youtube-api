export const VIDEO_DATE_VALUES = {
  none: 'none',
  hour: 'hour',
  today: 'today',
  week: 'week',
  month: 'month',
  year: 'year',
}

export const VIDEO_TYPE_VALUES = {
  all: 'all',
  video: 'video',
  channel: 'channel',
  playlist: 'playlist',
  movie: 'movie',
  show: 'show',
}

export const VIDEO_SORT_VALUES = {
  relevance: 'relevance',
  rating: 'rating',
  date: 'date',
  views: 'views',
}

export type VideoDate = keyof typeof VIDEO_DATE_VALUES

export type VideoSort = keyof typeof VIDEO_SORT_VALUES

export type VideoChannel = {
  channelId: string
  title: string
}

export type VideoItem = {
  videoId: string
  title: string
  duration: string
  channel: VideoChannel | null
}

export type NavigationPages = {
  nextPage: number
  prevPage: number
}

export type SearchNavigation = {
  prevPage: number
  nextPage: number
  page: number
}

export interface SearchResult {
  items: VideoItem[]
  pages: SearchNavigation
}
