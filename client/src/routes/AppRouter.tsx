import type { FC } from 'react'
import { Route, Routes } from 'react-router-dom'

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
import PrivateRoute from './PrivateRoute'

const AppRouter: FC = () => {
  return (
    <Routes>
      <Route element={<HomePage />} path={browseRoutes.base.home()} />
      <Route element={<NotFoundPage />} path={browseRoutes.base.notFound()} />

      <Route element={<LoginPage />} path={browseRoutes.auth.login()} />

      <Route element={<PrivateRoute />}>
        <Route element={<DomainIndexPage />} path={browseRoutes.domain.index()} />
      </Route>
      <Route element={<PrivateRoute />}>
        <Route element={<DomainCreatePage />} path={browseRoutes.domain.create()} />
      </Route>
      <Route element={<PrivateRoute />}>
        <Route element={<DomainViewPage />} path={browseRoutes.domain.view()} />
      </Route>
      <Route element={<PrivateRoute />}>
        <Route element={<DomainEditPage />} path={browseRoutes.domain.edit()} />
      </Route>

      <Route element={<PrivateRoute />}>
        <Route element={<InvidiousIndexPage />} path={browseRoutes.invidious.index()} />
      </Route>
      <Route element={<PrivateRoute />}>
        <Route element={<InvidiousCreatePage />} path={browseRoutes.invidious.create()} />
      </Route>
      <Route element={<PrivateRoute />}>
        <Route element={<InvidiousViewPage />} path={browseRoutes.invidious.view()} />
      </Route>
      <Route element={<PrivateRoute />}>
        <Route element={<InvidiousEditPage />} path={browseRoutes.invidious.edit()} />
      </Route>

      <Route element={<PrivateRoute />}>
        <Route element={<UseragentIndexPage />} path={browseRoutes.useragent.index()} />
      </Route>
      <Route element={<PrivateRoute />}>
        <Route element={<UseragentCreatePage />} path={browseRoutes.useragent.create()} />
      </Route>
      <Route element={<PrivateRoute />}>
        <Route element={<UseragentEditPage />} path={browseRoutes.useragent.edit()} />
      </Route>
      <Route element={<PrivateRoute />}>
        <Route element={<UseragentViewPage />} path={browseRoutes.useragent.view()} />
      </Route>

      <Route element={<PrivateRoute />}>
        <Route element={<SafeWordsIndexPage />} path={browseRoutes.safeWords.index()} />
      </Route>
      <Route element={<PrivateRoute />}>
        <Route element={<SafeWordsCreatePage />} path={browseRoutes.safeWords.create()} />
      </Route>
      <Route element={<PrivateRoute />}>
        <Route element={<SafeWordsViewPage />} path={browseRoutes.safeWords.view()} />
      </Route>
      <Route element={<PrivateRoute />}>
        <Route element={<SafeWordsEditPage />} path={browseRoutes.safeWords.edit()} />
      </Route>

      <Route element={<PrivateRoute />}>
        <Route element={<ProxyIndexPage />} path={browseRoutes.proxy.index()} />
      </Route>
      <Route element={<PrivateRoute />}>
        <Route element={<ProxyCreatePage />} path={browseRoutes.proxy.create()} />
      </Route>
      <Route element={<PrivateRoute />}>
        <Route element={<ProxyViewPage />} path={browseRoutes.proxy.view()} />
      </Route>
      <Route element={<PrivateRoute />}>
        <Route element={<ProxyEditPage />} path={browseRoutes.proxy.edit()} />
      </Route>

      <Route element={<PrivateRoute />}>
        <Route element={<ApiKeyIndexPage />} path={browseRoutes.apiKey.index()} />
      </Route>
      <Route element={<PrivateRoute />}>
        <Route element={<ApiKeyCreatePage />} path={browseRoutes.apiKey.create()} />
      </Route>
      <Route element={<PrivateRoute />}>
        <Route element={<ApiKeyViewPage />} path={browseRoutes.apiKey.view()} />
      </Route>
      <Route element={<PrivateRoute />}>
        <Route element={<ApiKeyEditPage />} path={browseRoutes.apiKey.edit()} />
      </Route>

      <Route element={<PrivateRoute />}>
        <Route element={<SettingsViewPage />} path={browseRoutes.settings.view()} />
      </Route>

      <Route element={<PrivateRoute />}>
        <Route element={<UserProfile />} path={browseRoutes.user.profile()} />
      </Route>
    </Routes>
  )
}

export default AppRouter
