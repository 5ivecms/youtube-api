import type { AnyAction } from '@reduxjs/toolkit'
import { configureStore } from '@reduxjs/toolkit'
import type { Dispatch } from 'react'
import type { TypedUseSelectorHook } from 'react-redux'
import { useDispatch, useSelector } from 'react-redux'

import { UserService } from '../services'
import { ApiKeyService } from '../services/apiKey'
import { AuthService } from '../services/auth'
import { DomainService } from '../services/domain'
import { InvidiousService } from '../services/invidious'
import { ProxyService } from '../services/proxy'
import { QuotaUsageService } from '../services/quotaUsage'
import { SafeWordsService } from '../services/safeWords'
import { SettingsService } from '../services/settings'
import { UseragentService } from '../services/useragent'
import { VideoBlacklistService } from '../services/video-blacklist'
import { YoutubeApikeyService } from '../services/youtubeApikey'
import auth from './slices/auth/slice'

export const store = configureStore({
  devTools: process.env.NODE_ENV === 'development',
  reducer: {
    [AuthService.reducerPath]: AuthService.reducer,
    [UseragentService.reducerPath]: UseragentService.reducer,
    [InvidiousService.reducerPath]: InvidiousService.reducer,
    [UserService.reducerPath]: UserService.reducer,
    [SafeWordsService.reducerPath]: SafeWordsService.reducer,
    [ProxyService.reducerPath]: ProxyService.reducer,
    [SettingsService.reducerPath]: SettingsService.reducer,
    [DomainService.reducerPath]: DomainService.reducer,
    [ApiKeyService.reducerPath]: ApiKeyService.reducer,
    [YoutubeApikeyService.reducerPath]: YoutubeApikeyService.reducer,
    [VideoBlacklistService.reducerPath]: VideoBlacklistService.reducer,
    [QuotaUsageService.reducerPath]: QuotaUsageService.reducer,
    auth,
  },
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware({}),
    AuthService.middleware,
    UseragentService.middleware,
    InvidiousService.middleware,
    UserService.middleware,
    SafeWordsService.middleware,
    ProxyService.middleware,
    SettingsService.middleware,
    DomainService.middleware,
    ApiKeyService.middleware,
    YoutubeApikeyService.middleware,
    VideoBlacklistService.middleware,
    QuotaUsageService.middleware,
  ],
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = (): Dispatch<AnyAction> => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
