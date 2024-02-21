import { browseRoutes } from '../../../core/config/routes.config'
import type { HeaderMenuItem } from './header.interfaces'

export const headerMenu: HeaderMenuItem[] = [
  { title: 'Домены', url: browseRoutes.domain.index() },
  // { title: 'Invidious', url: browseRoutes.invidious.index() },
  // { title: 'Юзерагенты', url: browseRoutes.useragent.index() },
  // { title: 'API KEYS', url: browseRoutes.apiKey.index() },
  { title: 'YT API KEYS', url: browseRoutes.youtubeApiKey.index() },
  { title: 'Прокси', url: browseRoutes.proxy.index() },
  { title: 'Стоп-слова', url: browseRoutes.safeWords.index() },
  { title: 'БЛ видео', url: browseRoutes.videoBlacklist.index() },
  { title: 'БЛ каналов', url: browseRoutes.channelBlacklist.index() },
  { title: 'Настройки', url: browseRoutes.settings.view() },
]
