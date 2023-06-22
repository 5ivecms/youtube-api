import { browseRoutes } from '../../../core/config/routes.config'
import type { HeaderMenuItem } from './header.interfaces'

export const headerMenu: HeaderMenuItem[] = [
  { title: 'Домены', url: browseRoutes.domain.index() },
  { title: 'Invidious', url: browseRoutes.invidious.index() },
  { title: 'Юзерагенты', url: browseRoutes.useragent.index() },
  { title: 'Стоп-слова', url: browseRoutes.safeWords.index() },
  { title: 'API KEYS', url: browseRoutes.apiKey.index() },
  { title: 'Прокси', url: browseRoutes.proxy.index() },
  { title: 'Настройки', url: browseRoutes.settings.view() },
]
