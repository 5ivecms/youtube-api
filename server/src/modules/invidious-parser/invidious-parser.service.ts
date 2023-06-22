import { BadRequestException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common'
import * as cheerio from 'cheerio'
import * as queryString from 'querystring'
import axios, { isAxiosError } from 'axios'

import { createInvidiousAxios } from './invidious.axios'
import { NavigationPages, SearchResult, VideoItem, VIDEO_SORT_VALUES } from './invidious.types'
import { GetVideoDto, SearchVideoDto } from './dto'
import { InvidiousService } from '../invidious/invidious.service'
import { InvidiousEntity } from '../invidious/invidious.entity'
import { UseragentService } from '../useragent/useragent.service'
import { DEFAULT_USERAGENT } from './constants'
import { SafeWordService } from '../safe-word/safe-word.service'
import { SettingsService } from '../settings/settings.service'
import { ProxyService } from '../proxy/proxy.service'
import { ProxyEntity } from '../proxy/proxy.entity'
import { InvidiousSettings } from '../settings/settings.types'

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

    while (!result) {
      const invidious = await this.invidiousService.getRandomHost()

      if (!invidious) {
        throw new BadRequestException('Нет invidious хостов')
      }

      const settings = await this.settingsService.getInvidiousSettings()
      const useragent = await this.getUseragent(invidious)
      const proxy = await this.getProxy(invidious, settings)
      const axiosInstance = createInvidiousAxios(invidious.host, useragent, settings.timeout, proxy)

      try {
        const { data, status } = await axiosInstance.get('/watch', {
          params: { v: dto.youtubeId },
        })
        const isWorkable = status === HttpStatus.OK
        if (!isWorkable) {
          await this.invidiousService.update(invidious.id, { isWorkable })
        }
        result = { id: dto.youtubeId, ...this.parseVideo(data) }
      } catch (e) {
        if (isAxiosError(e)) {
          await this.onErrorHost(invidious, e)
        }
      }
    }

    return result
  }

  public async getTrending() {
    let result = null

    while (!result) {
      const invidious = await this.invidiousService.getRandomHost()

      if (!invidious) {
        throw new BadRequestException('Нет invidious хостов')
      }

      const settings = await this.settingsService.getInvidiousSettings()
      const proxy = await this.getProxy(invidious, settings)
      const useragent = await this.getUseragent(invidious)
      const axiosInstance = createInvidiousAxios(invidious.host, useragent, settings.timeout, proxy)

      try {
        const { data, status } = await axiosInstance.get('/feed/trending', { timeout: 5000 })
        const isWorkable = status === HttpStatus.OK
        if (!isWorkable) {
          await this.invidiousService.update(invidious.id, { isWorkable })
        }
        result = this.parseVideos(data)
      } catch (e) {
        if (isAxiosError(e)) {
          await this.onErrorHost(invidious, e)
        }
      }
    }

    return result
  }

  public async getPopular() {
    let result = null

    while (!result) {
      const invidious = await this.invidiousService.getRandomHost()

      if (!invidious) {
        throw new BadRequestException('Нет invidious хостов')
      }

      const settings = await this.settingsService.getInvidiousSettings()
      const proxy = await this.getProxy(invidious, settings)
      const useragent = await this.getUseragent(invidious)
      const axiosInstance = createInvidiousAxios(invidious.host, useragent, settings.timeout, proxy)

      try {
        const { data, status } = await axiosInstance.get('/feed/popular')
        const isWorkable = status === HttpStatus.OK
        if (!isWorkable) {
          await this.invidiousService.update(invidious.id, { isWorkable })
        }

        result = this.parseVideos(data)
      } catch (e) {
        if (isAxiosError(e)) {
          await this.onErrorHost(invidious, e)
        }
      }
    }

    return result
  }

  public async search(dto: SearchVideoDto): Promise<SearchResult> {
    let result = null

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

      const settings = await this.settingsService.getInvidiousSettings()
      const proxy = await this.getProxy(invidious, settings)
      const useragent = await this.getUseragent(invidious)
      const axiosInstance = createInvidiousAxios(invidious.host, useragent, settings.timeout, proxy)

      try {
        const { data, status } = await axiosInstance.get('/search', { params: { ...dto, page, region, sort } })
        const isWorkable = status === HttpStatus.OK
        if (!isWorkable) {
          await this.invidiousService.update(invidious.id, { isWorkable })
        }
        const pages = this.parsePagination(data)
        result = { items: this.parseVideos(data), pages: { ...pages, page } }
      } catch (e) {
        if (isAxiosError(e)) {
          await this.onErrorHost(invidious, e)
        }
      }
    }

    return result
  }

  private parseVideo(html: string) {
    const $ = cheerio.load(html)

    const title = $('h1').text().trim()
    const description = $('#descriptionWrapper').text().trim()
    const views = Number($('#views').text().trim())
    const likes = Number($('#likes').text().replace(',', '').trim())
    const related = this.parseRelatedVideos($)

    return { title, description, views, likes, related }
  }

  private parseRelatedVideos($: cheerio.Root): VideoItem[] {
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

        const cardFooter = $(card).next('h5.pure-g')
        const cardFooterLeft = $(cardFooter).first()

        const videoId = cardHref.replace('/watch?v=', '').replace('&listen=false', '').trim()
        const title = $(card).children('p').text().trim()
        const duration = $(card).find('.length').text().trim()
        const channelName = $(cardFooterLeft).find('a').text().trim()
        const channelId = $(cardFooterLeft).find('a').attr('href').replace('/channel/', '').trim()

        relatedVideos.push({ videoId, title, duration, channel: { title: channelName, channelId } })
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
          return
        }

        const cardHref = $(videoCards[key]).children('a').attr('href')
        if (cardHref.indexOf('watch') == -1) {
          return
        }

        const videoId = cardHref.replace('/watch?v=', '').trim()
        const title = $(videoCards[key]).find('> a > p[dir="auto"]').text().trim()
        const duration = $(videoCards[key]).find('.thumbnail .length').text().trim()

        const channelNameNode = $(videoCards[key]).find('.channel-name')
        const channelId = channelNameNode.parent('a').attr('href').replace('/channel/', '').trim()
        const channelName = channelNameNode.text().trim()

        videos.push({ videoId, title, duration, channel: { title: channelName, channelId } })
      } catch {
        return
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
    const hosts: string[] = data
      .map(([_, data]) => data.uri)
      .filter((domain: string) => domain.indexOf('.onion') === -1)
      .filter((domain: string) => domain.indexOf('.i2p') === -1)

    await Promise.all(
      hosts.map(async (host) => {
        let existHost = await this.invidiousService.findOneByHost(host)
        if (!existHost) {
          await this.invidiousService.create({ host })
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
}
