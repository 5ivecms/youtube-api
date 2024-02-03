import { registerAs } from '@nestjs/config'

export type YoutubeCacheSettings = {
  search: number
  categories: number
  videoById: number
  videoByCategoryId: number
  videoByChannelId: number
  videoByPlaylistId: number
  videoComments: number
  trends: number
  categoriesWithVideos: number
}

export type ParserSettings = {
  saveVideoDescription: boolean
}

export type SettingsConfig = {
  invidious: {
    proxy: string
    timeout: string
  }
  app: {
    enabled: boolean
  }
  apiKeys: {
    apiKeyPerProxyLimit: number
  }
  youtubeCache: YoutubeCacheSettings
  parser: ParserSettings
}

export default registerAs(
  'settings',
  (): SettingsConfig => ({
    invidious: {
      proxy: process.env.SETTINGS_INVIDIOUS_PROXY || '0',
      timeout: process.env.SETTINGS_INVIDIOUS_TIMEOUT || '2000',
    },
    app: {
      enabled: Boolean(process.env.SETTINGS_APP_ENABLED),
    },
    apiKeys: {
      apiKeyPerProxyLimit: Number(process.env.SETTINGS_API_KEY_PER_PROXY),
    },
    youtubeCache: {
      search: Number(process.env.YOUTUBE_SEARCH_CACHE_DAYS),
      categories: Number(process.env.YOUTUBE_CATEGORIES_CACHE_DAYS),
      videoById: Number(process.env.YOUTUBE_VIDEO_BY_ID_CACHE_DAYS),
      videoByCategoryId: Number(process.env.YOUTUBE_VIDEO_BY_CATEGORY_ID_CACHE_DAYS),
      videoByChannelId: Number(process.env.YOUTUBE_VIDEO_BY_CHANNEL_ID_CACHE_DAYS),
      videoByPlaylistId: Number(process.env.YOUTUBE_VIDEO_BY_PLAYLIST_ID_CACHE_DAYS),
      videoComments: Number(process.env.YOUTUBE_COMMENTS_CACHE_DAYS),
      trends: Number(process.env.YOUTUBE_TRENDS_CACHE_DAYS),
      categoriesWithVideos: Number(process.env.YOUTUBE_CATEGORIES_WITH_VIDEOS),
    },
    parser: {
      saveVideoDescription: Boolean(process.env.SETTINGS_PARSER_SAVE_VIDEO_DESCRIPTION),
    },
  })
)
