export const redisCacheKeys = {
  search: (q: string): string => `youtube-api-search-${q}`,
  videoById: (videoId: string): string => `youtube-api-video-by-id-${videoId}`,
  categories: (): string => `youtube-api-categories`,
  videoByCategoryId: (categoryId: string): string => `youtube-api-video-by-category-id-${categoryId}`,
  videoByChannelId: (channelId: string): string => `youtube-api-video-by-channel-id-${channelId}`,
  videoByPlaylistId: (playlistId: string): string => `youtube-api-video-by-playlist-id-${playlistId}`,
  comments: (videoId: string): string => `youtube-api-video-comments-${videoId}`,
  trends: (): string => `youtube-api-trends`,
  categoriesWithVideos: (): string => `categories-with-videos`,
}
