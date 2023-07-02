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

export type NavigationPages = {
  nextPage: number
  prevPage: number
}

export type SearchNavigation = {
  prevPage: number
  nextPage: number
  page: number
}

export type RequestUrl = 'video' | 'search' | 'trends' | 'popular'

export type InvidiousApiResponse = {
  videoId: string
  title: string
  description: string
  viewCount: number
  likeCount: number
  lengthSeconds: number
  recommendedVideos: {
    videoId: string
    title: string
    lengthSeconds: number
  }[]
}

export type InvidiousTrendsApiResponse = {
  title: string
  videoId: string
  videoThumbnails: [
    {
      quality: string
      url: string
      width: number
      height: number
    }
  ]

  lengthSeconds: number
  viewCount: number

  author: string
  authorId: string
  authorUrl: string

  published: number
  publishedText: string
  description: string
  descriptionHtml: string

  liveNow: boolean
  paid: boolean
  premium: boolean
}[]

export type InvidiousPopularApiResponse = {
  type: 'shortVideo'
  title: string
  videoId: string
  videoThumbnails: [
    {
      quality: string
      url: string
      width: number
      height: number
    }
  ]

  lengthSeconds: number
  viewCount: number

  author: string
  authorId: string
  authorUrl: string

  published: number
  publishedText: string
}[]

export type InvidiousSearchApiResponse = {
  type: 'video'
  title: string
  videoId: string
  author: string
  authorId: string
  authorUrl: string
  videoThumbnails: [
    {
      quality: string
      url: string
      width: number
      height: number
    }
  ]
  description: string
  descriptionHtml: string
  viewCount: number
  published: number
  publishedText: string
  lengthSeconds: number
  liveNow: boolean
  paid: boolean
  premium: boolean
}[]

export type VideoItem = {
  videoId: string
  title: string
  duration: string
}

export interface SearchResult {
  items: VideoItem[]
  pages: SearchNavigation
}

export type FullVideoItem = {
  id: string
  title: string
  description: string
  views: null | number
  likes: number
}

export type VideoReponse = FullVideoItem & {
  related: VideoItem[]
}
