export const CacheKeys = {
  search: (q: string = ''): string => `${q}`,
  videoById: (videoId: string = ''): string => `${videoId}`,
  categories: (): string => `categories`,
  videoByCategoryId: (categoryId: string = ''): string => `category-${categoryId}`,
  videoByChannelId: (channelId: string = ''): string => `${channelId}`,
  videoByPlaylistId: (playlistId: string = ''): string => `${playlistId}`,
  comments: (videoId: string = ''): string => `${videoId}`,
  trends: (): string => `trends`,
  categoriesWithVideos: (): string => `categories-with-videos`,
}

export const phraseInList = (list: string[], phrase: string) => {
  return list.filter((word) => phrase.toLocaleLowerCase().indexOf(word.toLocaleLowerCase()) !== -1).length > 0
}
