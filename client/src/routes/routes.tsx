import { ReactElement } from 'react'

import { browseRoutes } from '../core/config/routes.config'
import { ApiKeyCreatePage, ApiKeyEditPage, ApiKeyIndexPage, ApiKeyViewPage } from '../pages/apiKey'
import { LoginPage } from '../pages/auth'
import { DomainCreatePage, DomainEditPage, DomainIndexPage, DomainViewPage } from '../pages/domain'
import { InvidiousCreatePage, InvidiousEditPage, InvidiousIndexPage, InvidiousViewPage } from '../pages/invidious'
import { HomePage, NotFoundPage } from '../pages/main'
import { ProxyCreatePage, ProxyEditPage, ProxyIndexPage, ProxyViewPage } from '../pages/proxy'
import { SafeWordsCreatePage, SafeWordsEditPage, SafeWordsIndexPage, SafeWordsViewPage } from '../pages/safeWords'
import { SettingsViewPage } from '../pages/settings'
import { UserProfile } from '../pages/user'
import { UseragentCreatePage, UseragentEditPage, UseragentIndexPage, UseragentViewPage } from '../pages/useragent'
import {
  VideoBlacklistCreatePage,
  VideoBlacklistEditPage,
  VideoBlacklistIndexPage,
  VideoBlacklistViewPage,
} from '../pages/video-blacklist'
import {
  YoutubeApiKeyCreatePage,
  YoutubeApiKeyEditPage,
  YoutubeApiKeyIndexPage,
  YoutubeApiKeyViewPage,
} from '../pages/youtube-apikey'

export type AppRoute = {
  private: boolean
  element: ReactElement | null
  path: string
}

export const routes: AppRoute[] = [
  {
    element: <LoginPage />,
    private: false,
    path: browseRoutes.auth.login(),
  },
  {
    element: <NotFoundPage />,
    private: false,
    path: browseRoutes.base.notFound(),
  },
  {
    element: <HomePage />,
    private: true,
    path: browseRoutes.base.home(),
  },

  // Страницы доменов
  {
    element: <DomainIndexPage />,
    private: true,
    path: browseRoutes.domain.index(),
  },
  {
    element: <DomainCreatePage />,
    private: true,
    path: browseRoutes.domain.create(),
  },
  {
    element: <DomainViewPage />,
    private: true,
    path: browseRoutes.domain.view(),
  },
  {
    element: <DomainEditPage />,
    private: true,
    path: browseRoutes.domain.edit(),
  },

  // Страницы invidious
  {
    element: <InvidiousIndexPage />,
    private: true,
    path: browseRoutes.invidious.index(),
  },
  {
    element: <InvidiousCreatePage />,
    private: true,
    path: browseRoutes.invidious.create(),
  },
  {
    element: <InvidiousViewPage />,
    private: true,
    path: browseRoutes.invidious.view(),
  },
  {
    element: <InvidiousEditPage />,
    private: true,
    path: browseRoutes.invidious.edit(),
  },

  // Страницы useragent
  {
    element: <UseragentIndexPage />,
    private: true,
    path: browseRoutes.useragent.index(),
  },
  {
    element: <UseragentCreatePage />,
    private: true,
    path: browseRoutes.useragent.create(),
  },
  {
    element: <UseragentEditPage />,
    private: true,
    path: browseRoutes.useragent.edit(),
  },
  {
    element: <UseragentViewPage />,
    private: true,
    path: browseRoutes.useragent.view(),
  },

  // Страницы стоп-слов
  {
    element: <SafeWordsIndexPage />,
    private: true,
    path: browseRoutes.safeWords.index(),
  },
  {
    element: <SafeWordsCreatePage />,
    private: true,
    path: browseRoutes.safeWords.create(),
  },
  {
    element: <SafeWordsViewPage />,
    private: true,
    path: browseRoutes.safeWords.view(),
  },
  {
    element: <SafeWordsEditPage />,
    private: true,
    path: browseRoutes.safeWords.edit(),
  },

  // Страницы прокси
  {
    element: <ProxyIndexPage />,
    private: true,
    path: browseRoutes.proxy.index(),
  },
  {
    element: <ProxyCreatePage />,
    private: true,
    path: browseRoutes.proxy.create(),
  },
  {
    element: <ProxyViewPage />,
    private: true,
    path: browseRoutes.proxy.view(),
  },
  {
    element: <ProxyEditPage />,
    private: true,
    path: browseRoutes.proxy.edit(),
  },

  // Страницы APIKEY
  {
    element: <ApiKeyIndexPage />,
    private: true,
    path: browseRoutes.apiKey.index(),
  },
  {
    element: <ApiKeyCreatePage />,
    private: true,
    path: browseRoutes.apiKey.create(),
  },
  {
    element: <ApiKeyViewPage />,
    private: true,
    path: browseRoutes.apiKey.view(),
  },
  {
    element: <ApiKeyEditPage />,
    private: true,
    path: browseRoutes.apiKey.edit(),
  },

  // Страницы youtube apikey
  {
    element: <YoutubeApiKeyIndexPage />,
    private: true,
    path: browseRoutes.youtubeApiey.index(),
  },
  {
    element: <YoutubeApiKeyCreatePage />,
    private: true,
    path: browseRoutes.youtubeApiey.create(),
  },
  {
    element: <YoutubeApiKeyViewPage />,
    private: true,
    path: browseRoutes.youtubeApiey.view(),
  },
  {
    element: <YoutubeApiKeyEditPage />,
    private: true,
    path: browseRoutes.youtubeApiey.edit(),
  },

  // Страницы настроек
  {
    element: <SettingsViewPage />,
    private: true,
    path: browseRoutes.settings.view(),
  },
  {
    element: <UserProfile />,
    private: true,
    path: browseRoutes.user.profile(),
  },

  // Черный список видео
  {
    element: <VideoBlacklistIndexPage />,
    private: true,
    path: browseRoutes.videoBlacklist.index(),
  },
  {
    element: <VideoBlacklistCreatePage />,
    private: true,
    path: browseRoutes.videoBlacklist.create(),
  },
  {
    element: <VideoBlacklistEditPage />,
    private: true,
    path: browseRoutes.videoBlacklist.edit(),
  },
  {
    element: <VideoBlacklistViewPage />,
    private: true,
    path: browseRoutes.videoBlacklist.view(),
  },
]
