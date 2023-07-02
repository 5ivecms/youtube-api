import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common'
import * as cheerio from 'cheerio'
import * as queryString from 'querystring'
import axios, { isAxiosError } from 'axios'

import { createInvidiousAxios } from './invidious.axios'
import {
  NavigationPages,
  SearchResult,
  VideoItem,
  VIDEO_SORT_VALUES,
  VideoReponse,
  InvidiousApiResponse,
  InvidiousTrendsApiResponse,
  InvidiousPopularApiResponse,
  InvidiousSearchApiResponse,
} from './invidious.types'
import { GetVideoDto, SearchVideoDto } from './dto'
import { InvidiousService } from '../invidious/invidious.service'
import { InvidiousEntity } from '../invidious/invidious.entity'
import { UseragentService } from '../useragent/useragent.service'
import { DEFAULT_USERAGENT, INVIDIOUS_API_URL, INVIDIOUS_SITE_URL } from './constants'
import { SafeWordService } from '../safe-word/safe-word.service'
import { SettingsService } from '../settings/settings.service'
import { ProxyService } from '../proxy/proxy.service'
import { ProxyEntity } from '../proxy/proxy.entity'
import { InvidiousSettings } from '../settings/settings.types'
import { formatTime } from 'src/utils'

@Injectable()
export class InvidiousParserService {
  constructor(
    private readonly invidiousService: InvidiousService,
    private readonly useragentService: UseragentService,
    private readonly safeWordService: SafeWordService,
    private readonly settingsService: SettingsService,
    private readonly proxyService: ProxyService
  ) {}

  public async getVideo(dto: GetVideoDto) {
    let result = null
    const settings = await this.settingsService.getInvidiousSettings()

    while (!result) {
      const invidious = await this.invidiousService.getRandomHost()
      if (!invidious) {
        throw new BadRequestException('Нет invidious хостов')
      }

      const useApi = settings.api && invidious.api && invidious.useApi
      const useragent = await this.getUseragent(invidious)
      const proxy = await this.getProxy(invidious, settings)
      const axiosInstance = createInvidiousAxios(invidious.host, useragent, settings.timeout, proxy)

      try {
        if (useApi) {
          const { data, status } = await axiosInstance.get<InvidiousApiResponse>(INVIDIOUS_API_URL.video(dto.youtubeId))
          await this.updateInvidiousStatus(invidious, status)
          result = this.prepareInvidiousApiVideoResponse(data)
        } else {
          const { data, status } = await axiosInstance.get(INVIDIOUS_SITE_URL.video(dto.youtubeId))
          await this.updateInvidiousStatus(invidious, status)
          result = this.parseVideo(data, dto.youtubeId)
        }
      } catch (e) {
        if (isAxiosError(e)) {
          await this.onErrorHost(invidious, e)
        }
      }
    }

    return result
  }

  public async getTrending() {
    let result: VideoItem[] | null = null
    const settings = await this.settingsService.getInvidiousSettings()

    while (!result) {
      const invidious = await this.invidiousService.getRandomHost()
      if (!invidious) {
        throw new BadRequestException('Нет invidious хостов')
      }

      const useApi = settings.api && invidious.api && invidious.useApi
      const useragent = await this.getUseragent(invidious)
      const proxy = await this.getProxy(invidious, settings)
      const axiosInstance = createInvidiousAxios(invidious.host, useragent, settings.timeout, proxy)

      try {
        if (useApi) {
          const { data, status } = await axiosInstance.get<InvidiousTrendsApiResponse>(INVIDIOUS_API_URL.trends())
          await this.updateInvidiousStatus(invidious, status)
          result = this.prepareInvidiousApiTrendsResponse(data)
        } else {
          const { data, status } = await axiosInstance.get(INVIDIOUS_SITE_URL.trends())
          await this.updateInvidiousStatus(invidious, status)
          result = this.parseVideos(data)
        }
      } catch (e) {
        if (isAxiosError(e)) {
          await this.onErrorHost(invidious, e)
        }
      }
    }

    return result
  }

  public async getPopular() {
    let result: VideoItem[] | null = null
    const settings = await this.settingsService.getInvidiousSettings()

    while (!result) {
      const invidious = await this.invidiousService.getRandomHost()
      if (!invidious) {
        throw new BadRequestException('Нет invidious хостов')
      }

      const useApi = settings.api && invidious.api && invidious.useApi
      const proxy = await this.getProxy(invidious, settings)
      const useragent = await this.getUseragent(invidious)
      const axiosInstance = createInvidiousAxios(invidious.host, useragent, settings.timeout, proxy)

      try {
        if (useApi) {
          const { data, status } = await axiosInstance.get<InvidiousPopularApiResponse>(INVIDIOUS_API_URL.popular())
          await this.updateInvidiousStatus(invidious, status)
          result = this.prepareInvidiousApiPopularResponse(data)
        } else {
          const { data, status } = await axiosInstance.get(INVIDIOUS_SITE_URL.popular())
          await this.updateInvidiousStatus(invidious, status)
          result = this.parseVideos(data)
        }
      } catch (e) {
        if (isAxiosError(e)) {
          await this.onErrorHost(invidious, e)
        }
      }
    }

    return result
  }

  public async search(dto: SearchVideoDto): Promise<SearchResult> {
    let result: SearchResult | null = null
    const settings = await this.settingsService.getInvidiousSettings()

    while (!result) {
      const page = Number(dto.page || 1)
      const region = dto.region || 'RU'
      const sort = dto.sort || VIDEO_SORT_VALUES.relevance

      let canSearch = true
      const safeWords = (await this.safeWordService.findAll()).map((item) => item.phrase.toLocaleLowerCase())
      safeWords.forEach((word) => {
        if (word.indexOf(dto.q.toLocaleLowerCase()) !== -1) {
          canSearch = false
        }
      })

      if (!canSearch) {
        return { items: [], pages: { nextPage: 0, prevPage: 0, page: 0 } }
      }

      const invidious = await this.invidiousService.getRandomHost()
      if (!invidious) {
        throw new BadRequestException('Нет invidious хостов')
      }

      const useApi = settings.api && invidious.api && invidious.useApi
      const proxy = await this.getProxy(invidious, settings)
      const useragent = await this.getUseragent(invidious)
      const axiosInstance = createInvidiousAxios(invidious.host, useragent, settings.timeout, proxy)

      try {
        if (useApi) {
          const { data, status } = await axiosInstance.get(INVIDIOUS_API_URL.search(), {
            params: { q: dto.q, type: 'video', region: 'RU' },
          })
          await this.updateInvidiousStatus(invidious, status)
          result = this.prepareInvidiousApiSearchResponse(data)
        } else {
          const { data, status } = await axiosInstance.get(INVIDIOUS_SITE_URL.search(), {
            params: { ...dto, page, region, sort },
          })
          await this.updateInvidiousStatus(invidious, status)
          const pages = this.parsePagination(data)
          result = { items: this.parseVideos(data), pages: { ...pages, page } }
        }
      } catch (e) {
        if (isAxiosError(e)) {
          await this.onErrorHost(invidious, e)
        }
      }
    }

    return result
  }

  private parseVideo(html: string, videoId: string): VideoReponse {
    const $ = cheerio.load(html)

    const title = $('h1').text().trim()
    const description = $('#descriptionWrapper').text().trim()
    const views = Number($('#views').text().trim())
    const likes = Number($('#likes').text().replace(',', '').trim())
    const related = this.parseRelatedVideos($)

    return { id: videoId, title, description, views, likes, related }
  }

  private parseRelatedVideos($: any): VideoItem[] {
    const relatedVideos: VideoItem[] = []
    const relatedVideosThumbs = $('.pure-u-1.pure-u-lg-1-5 div.thumbnail')
    Object.keys(relatedVideosThumbs).forEach((key) => {
      try {
        if (relatedVideosThumbs[key].type !== 'tag') {
          return
        }

        const card = $(relatedVideosThumbs[key]).parent('a')
        const cardHref = $(card).attr('href')
        if (cardHref.indexOf('watch') == -1) {
          return
        }

        const videoId = cardHref.replace('/watch?v=', '').replace('&listen=false', '').trim()
        const title = $(card).children('p').text().trim()
        const duration = $(card).find('.length').text().trim()

        relatedVideos.push({ videoId, title, duration })
      } catch {
        return
      }
    })

    return relatedVideos
  }

  private parseVideos(html: string): VideoItem[] {
    const $ = cheerio.load(html)
    const videoCards = $('.pure-u-1.pure-u-md-1-4 .h-box')

    const videos: VideoItem[] = []
    Object.keys(videoCards).forEach((key) => {
      try {
        if (videoCards[key].type !== 'tag') {
          return []
        }

        const cardHref = $(videoCards[key]).children('a').attr('href')
        if (cardHref.indexOf('watch') == -1) {
          return []
        }

        const videoId = cardHref.replace('/watch?v=', '').trim()
        const title = $(videoCards[key]).find('> a > p[dir="auto"]').text().trim()
        const duration = $(videoCards[key]).find('.thumbnail .length').text().trim()

        videos.push({ videoId, title, duration })
      } catch {
        return []
      }
    })

    return videos
  }

  private parsePagination(html: string): NavigationPages {
    let nextPage = 1
    let prevPage = 1

    const $ = cheerio.load(html)
    const topPagination = $('.pure-g.h-box.v-box')

    const lastNode = $(topPagination).children().last()
    const nextPageHref = lastNode.find('a').attr('href')
    if (nextPageHref && nextPageHref.indexOf('page=') !== -1) {
      const queryData = queryString.parse(nextPageHref)
      nextPage = Number(queryData.page)
    }

    const firstNode = $(topPagination).children().first()
    const prevPageHref = firstNode.find('a').attr('href')
    if (prevPageHref && prevPageHref.indexOf('page=') !== -1) {
      const queryData = queryString.parse(prevPageHref)
      prevPage = Number(queryData.page)
    }

    return { nextPage, prevPage }
  }

  public async healthCheck(id: number) {
    const invidious = await this.invidiousService.findOne(id)
    try {
      const settings = await this.settingsService.getInvidiousSettings()
      const proxy = await this.getProxy(invidious, settings)

      const useragent = await this.getUseragent(invidious)
      const axiosInstance = createInvidiousAxios(invidious.host, useragent, settings.timeout, proxy)
      const response = await axiosInstance.get('/feed/trending', { timeout: settings.timeout })
      const requestDuration = Number(response.headers['request-duration'])
      const isWorkable = response.status === HttpStatus.OK
      return await this.invidiousService.updateHostState(invidious, isWorkable, requestDuration)
    } catch (e) {
      await this.onErrorHost(invidious, e)
      return await this.invidiousService.updateHostState(invidious, false)
    }
  }

  public async healthCheckAll(): Promise<InvidiousEntity[]> {
    const hosts = await this.invidiousService.findAll()
    const settings = await this.settingsService.getInvidiousSettings()
    return await Promise.all(
      hosts.map(async (host) => {
        try {
          const proxy = await this.getProxy(host, settings)
          const useragent = await this.getUseragent(host)
          const axiosInstance = createInvidiousAxios(host.host, useragent, settings.timeout, proxy)
          const response = await axiosInstance.get('/feed/trending')
          const requestDuration = Number(response.headers['request-duration'])
          const isWorkable = response.status === HttpStatus.OK
          return await this.invidiousService.updateHostState(host, isWorkable, requestDuration)
        } catch (e) {
          await this.onErrorHost(host, e)
          return await this.invidiousService.updateHostState(host, false)
        }
      })
    )
  }

  public async loadHosts() {
    const { data } = await axios.get('https://api.invidious.io/instances.json?pretty=1&sort_by=type,users')
    const hosts: [] = data
      .map(([_, { cors, api, type, uri }]) => ({ cors, api, type, uri }))
      .filter(({ uri }) => uri.indexOf('.onion') === -1)
      .filter(({ uri }) => uri.indexOf('.i2p') === -1)

    await Promise.all(
      hosts.map(async ({ cors, api, type, uri: host }) => {
        let existHost = await this.invidiousService.findOneByHost(host)
        if (!existHost) {
          await this.invidiousService.create({ host, cors, api, type })
        }
      })
    )
  }

  private async onErrorHost(invidious: InvidiousEntity, e?: any) {
    await this.invidiousService.excludeHost(invidious)
    await this.invidiousService.reIndex()
    if (isAxiosError(e)) {
      await this.invidiousService.addLog(invidious.id, e?.message)
    }
  }

  private async getUseragent(invidious: InvidiousEntity): Promise<string> {
    let useragent = DEFAULT_USERAGENT
    if (invidious.useRandomUseragent) {
      const useragentEntity = await this.useragentService.getRandomUseragent()
      if (useragentEntity) {
        useragent = useragentEntity.useragent
      }
    }
    return useragent
  }

  private async getProxy(invidious: InvidiousEntity, settings: InvidiousSettings): Promise<ProxyEntity | undefined> {
    return settings.proxy && invidious.useProxy ? await this.proxyService.getRandomProxy() : undefined
  }

  private async updateInvidiousStatus(invidious: InvidiousEntity, status: number) {
    const isWorkable = status === HttpStatus.OK
    if (!isWorkable) {
      await this.invidiousService.update(invidious.id, { isWorkable })
    }
  }

  private prepareInvidiousApiVideoResponse(response: InvidiousApiResponse): VideoReponse {
    const related = response.recommendedVideos.map(({ lengthSeconds, title, videoId }) => ({
      title,
      videoId,
      duration: formatTime(lengthSeconds),
    }))
    return {
      id: response.videoId,
      title: response.title,
      description: response.description,
      views: response.viewCount,
      likes: response.likeCount,
      related,
    }
  }

  private prepareInvidiousApiTrendsResponse(response: InvidiousTrendsApiResponse): VideoItem[] {
    return response.map((data) => ({
      duration: formatTime(data.lengthSeconds),
      title: data.title,
      videoId: data.videoId,
    }))
  }

  private prepareInvidiousApiPopularResponse(response: InvidiousPopularApiResponse): VideoItem[] {
    return response.map((data) => ({
      duration: formatTime(data.lengthSeconds),
      title: data.title,
      videoId: data.videoId,
    }))
  }

  private prepareInvidiousApiSearchResponse(response: InvidiousSearchApiResponse): SearchResult {
    return {
      items: response.map((data) => ({
        duration: formatTime(data.lengthSeconds),
        title: data.title,
        videoId: data.videoId,
      })),
      pages: {
        nextPage: 1,
        prevPage: 1,
        page: 1,
      },
    }
  }
}
