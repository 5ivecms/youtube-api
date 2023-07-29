export type Video = {
  id: string
  title: string
  description: string
  duration: string
  readabilityDuration: string
  views: number
  channelId: string
  channelTitle: string
  timeAgo: string
  publishedAt: Date
}

export type Category = {
  id: string
  title: string
  channelId: string
}

export type Comment = {
  text: string
  author: string
  avatar: string
  publishedAt: Date
}

type VideoCategory = {
  kind: string
  etag: string
  id: string
  snippet: {
    title: string
    assignable: boolean
    channelId: string
  }
}

type VideoFull = {
  kind: 'youtube#video'
  etag: string
  id: string
  snippet: {
    publishedAt: Date
    channelId: string
    title: string
    description: string
    thumbnails: {
      default: VideoThumb
      medium: VideoThumb
      high: VideoThumb
      standard: VideoThumb
      maxres: VideoThumb
    }
    channelTitle: string
    tags: string[]
    categoryId: string
    liveBroadcastContent: string
    defaultLanguage: string
    localized: {
      title: string
      description: string
    }
    defaultAudioLanguage: string
  }
  contentDetails: VideoContentDetails
  statistics: VideoStatistic
}

export type CategoryWithVideos = {
  category: Category
  videos: Video[]
}

export type FullVideoData = {
  video: Video
  comments: Comment[]
  related: Video[]
}

type Pageinfo = {
  totalResults: number
  resultsPerPage: number
}

type VideoContentDetails = {
  duration: string
  dimension: string
  definition: string
  caption: string
  licensedContent: false
  contentRating: object
  projection: string
}

type VideoStatistic = {
  viewCount: string
  likeCount: string
  favoriteCount: string
  commentCount: string
}

type VideoThumb = {
  url: string
  width: number
  height: number
}

type VideoSnippet = {
  kind: string
  etag: string
  id: {
    kind: string
    videoId: string
  }
  snippet: {
    publishedAt: Date
    channelId: string
    title: string
    description: string
    thumbnails: {
      default: VideoThumb
      medium: VideoThumb
      high: VideoThumb
    }
    channelTitle: string
    liveBroadcastContent: string
    publishTime: string
  }
  contentDetails: VideoContentDetails
  statistics: VideoStatistic
}

type VideoListItem = {
  kind: 'youtube#video'
  etag: string
  id: string
  snippet: {
    publishedAt: Date
    title: string
    description: string
    channelId: string
    channelTitle: string
    thumbnails: {
      default: VideoThumb
      medium: VideoThumb
      high: VideoThumb
      standard: VideoThumb
      maxres: VideoThumb
    }

    tags: string[]
    categoryId: string
    liveBroadcastContent: string
    localized: {
      title: string
      description: string
    }
  }
  contentDetails: VideoContentDetails
  statistics: VideoStatistic
}

type VideoPlaylistItem = {
  kind: 'youtube#playlistItem'
  etag: string
  id: string
  snippet: {
    publishedAt: Date
    channelId: string
    title: string
    description: string
    thumbnails: {
      default: VideoThumb
      medium: VideoThumb
      high: VideoThumb
      standard: VideoThumb
      maxres: VideoThumb
    }
    channelTitle: string
    playlistId: string
    position: number
    resourceId: {
      kind: string
      videoId: string
    }
    videoOwnerChannelTitle: string
    videoOwnerChannelId: string
  }
  contentDetails: VideoContentDetails
  statistics: VideoStatistic
}

export type YTError = {
  message: string
  domain: string
  reason: string
}

type Channel = {
  kind: 'youtube#channel'
  etag: string
  id: string
  contentDetails: {
    relatedPlaylists: {
      likes: string
      uploads: string
    }
  }
}

type YTComment = {
  kind: 'youtube#commentThread'
  etag: string
  id: string
  snippet: {
    videoId: string
    topLevelComment: {
      kind: 'youtube#comment'
      etag: string
      id: string
      snippet: {
        videoId: string
        textDisplay: string
        textOriginal: string
        authorDisplayName: string
        authorProfileImageUrl: string
        authorChannelUrl: string
        authorChannelId: {
          value: string
        }
        canRate: boolean
        viewerRating: string
        likeCount: number
        publishedAt: Date
        updatedAt: Date
      }
    }
    canReply: boolean
    totalReplyCount: number
    isPublic: boolean
  }
}

export type ErrorResponse = {
  error: {
    code: number
    message: string
    errors: YTError[]
  }
}

export type ChannelListResponse = {
  kind: 'youtube#channelListResponse'
  etag: string
  pageInfo: Pageinfo
  items: Channel[]
}

export type SearchResponse = {
  kind: 'youtube#searchResult'
  etag: string
  nextPageToken: string
  regionCode: string
  pageInfo: {
    totalResults: number
    resultsPerPage: number
  }
  items: VideoSnippet[]
}

export type VideoCategoriesResponse = {
  kind: 'youtube#videoCategoryListResponse'
  etag: string
  items: VideoCategory[]
}

export type VideoFullResponse = {
  kind: 'youtube#videoListResponse'
  etag: string
  items: VideoFull[]
  pageInfo: Pageinfo
}

export type VideoListResponse = {
  kind: 'youtube#videoListResponse'
  etag: string
  items: VideoListItem[]
}

export type PlaylistItemListResponse = {
  kind: 'youtube#playlistItemListResponse'
  etag: string
  nextPageToken: string
  items: VideoPlaylistItem[]
  pageInfo: Pageinfo
}

export type CommentThreadListResponse = {
  kind: 'youtube#commentThreadListResponse'
  etag: string
  pageInfo: Pageinfo
  items: YTComment[]
}
