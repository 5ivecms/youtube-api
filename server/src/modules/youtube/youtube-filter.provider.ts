import { Injectable } from '@nestjs/common'
import { LanguageCode } from 'cld3-asm'

import { SafeWordService } from '../safe-word/safe-word.service'
import { Cld3Service } from '../cld3/cld3.service'
import { Video } from './youtube-api.types'
import { VideoBlacklistService } from '../video-blacklist/video-blacklist.service'
import { ChannelBlacklistService } from '../channel-blacklist/channel-blacklist.service'
import { ChannelNotFoundException, VideoNotFound } from './exceptions'
import { phraseInList } from './utils'

@Injectable()
export class YoutubeFilterProvider {
  constructor(
    private readonly safeWordsService: SafeWordService,
    private readonly cld3Service: Cld3Service,
    private readonly videoBlacklistService: VideoBlacklistService,
    private readonly channelBlacklistService: ChannelBlacklistService
  ) {}

  public async isAcceptablePhrase(phrase: string) {
    const safeWords = await this.safeWordsService.getAllSafeWords()
    const isBad = phraseInList(safeWords, phrase)
    return !isBad
  }

  public isAcceptableCountryByText(text: string) {
    const country = this.detectCountryByText(text)
    return country !== LanguageCode.UK
  }

  public async getWhiteVideoIds(ids: string[]) {
    const blackList = await this.videoBlacklistService.blacklist()
    const filteredIds = ids.filter((id) => !blackList.includes(id))
    return filteredIds
  }

  public async getWhiteVideos(videos: Video[]): Promise<Video[]> {
    const [videoBlacklist, channelBlacklist, stopWords] = await Promise.all([
      this.videoBlacklistService.blacklist(),
      this.channelBlacklistService.blacklist(),
      this.safeWordsService.getAllSafeWords(),
    ])

    const filteredVideos = videos.filter(
      ({ id, titleLang, channelId, channelTitle, channelTitleLang, title }) =>
        !videoBlacklist.includes(id) &&
        !channelBlacklist.includes(channelId) &&
        titleLang !== LanguageCode.UK &&
        channelTitleLang !== LanguageCode.UK &&
        !this.channelOrTitleInList(stopWords, channelTitle, title)
    )

    return filteredVideos
  }

  public async tryVideoId(videoId: string) {
    const inBlackList = await this.videoIdInBlacklist(videoId)
    if (inBlackList) {
      throw new VideoNotFound()
    }
  }

  public async tryVideo(video: Video) {
    if (video.titleLang === LanguageCode.UK) {
      throw new VideoNotFound()
    }
    const [isAcceptableTitle, isChannelInBlacklist] = await Promise.all([
      this.isAcceptablePhrase(video.title),
      this.channelInBlacklist(video.channelId),
    ])
    if (isChannelInBlacklist || !isAcceptableTitle) {
      throw new VideoNotFound()
    }
  }

  public async tryChannel(channelId: string) {
    const isChannelInBlacklist = await this.channelBlacklistService.inBlacklist(channelId)
    if (isChannelInBlacklist) {
      throw new ChannelNotFoundException()
    }
  }

  public async channelInBlacklist(channelId: string) {
    return await this.channelBlacklistService.inBlacklist(channelId)
  }

  public async videoIdInBlacklist(videoId: string) {
    return await this.videoBlacklistService.inBlacklist(videoId)
  }

  public detectCountryByText(text: string) {
    const result = this.cld3Service.detect(text)
    return result.language
  }

  private channelOrTitleInList(list: string[], channel: string, title: string) {
    return (
      list.filter(
        (word) =>
          channel.toLocaleLowerCase().indexOf(word.toLocaleLowerCase()) !== -1 ||
          title.toLocaleLowerCase().indexOf(word.toLocaleLowerCase()) !== -1
      ).length > 0
    )
  }
}
