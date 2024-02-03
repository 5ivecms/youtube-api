import { SettingsEntity } from './settings.entity'
import { SettingsEnum } from './settings.types'

export const SETTINGS_CACHE_KEY = 'SETTINGS_CACHE'
export const YOUTUBE_CACHE_SETTINGS_KEY = 'YOUTUBE_CACHE_SETTINGS'
export const PARSER_SETTINGS_KEY = 'PARSER_SETTINGS_CACHE'
export const APP_SETTINGS_CACHE_KEY = 'APP_SETTINGS_CACHE'
export const API_KEY_SETTINGS_CACHE_KEY = 'API_KEY_SETTINGS_CACHE'

export const invidiousBaseSettings: Omit<SettingsEntity, 'id'>[] = [
  {
    option: 'proxy',
    section: 'invidious',
    type: SettingsEnum.BOOLEAN,
    value: '0',
    label: 'Использовать прокси',
  },
  {
    option: 'api',
    section: 'invidious',
    type: SettingsEnum.BOOLEAN,
    value: '0',
    label: 'Использовать API',
  },
  {
    option: 'timeout',
    section: 'invidious',
    type: SettingsEnum.INTEGER,
    value: '2000',
    label: 'Таймаут хоста',
  },
]

export const appBaseSettings: Omit<SettingsEntity, 'id'>[] = [
  {
    option: 'enabled',
    section: 'app',
    type: SettingsEnum.BOOLEAN,
    value: '0',
    label: 'Включить API',
  },
]

export const apiKeysBaseSettings: Omit<SettingsEntity, 'id'>[] = [
  {
    option: 'apiKeyPerProxyLimit',
    section: 'apiKeys',
    type: SettingsEnum.INTEGER,
    value: '5',
    label: 'Ключей на прокси',
  },
]

export const parserBaseSettings: Omit<SettingsEntity, 'id'>[] = [
  {
    option: 'saveVideoDescription',
    section: 'parser',
    type: SettingsEnum.BOOLEAN,
    value: '0',
    label: 'Сохранять описание видео',
  },
]

export const youtubeCacheBaseSettings: Omit<SettingsEntity, 'id'>[] = [
  {
    option: 'search',
    section: 'youtubeCache',
    type: SettingsEnum.INTEGER,
    value: '3',
    label: 'Кеш результатов поиска, дней',
  },
  {
    option: 'categories',
    section: 'youtubeCache',
    type: SettingsEnum.INTEGER,
    value: '3',
    label: 'Кеш списка категорий, дней',
  },
  {
    option: 'videoById',
    section: 'youtubeCache',
    type: SettingsEnum.INTEGER,
    value: '3',
    label: 'Кеш видео по id, дней',
  },
  {
    option: 'videoByCategoryId',
    section: 'youtubeCache',
    type: SettingsEnum.INTEGER,
    value: '3',
    label: 'Кеш страницы категории, дней',
  },
  {
    option: 'videoByChannelId',
    section: 'youtubeCache',
    type: SettingsEnum.INTEGER,
    value: '3',
    label: 'Кеш страницы канала, дней',
  },
  {
    option: 'videoByPlaylistId',
    section: 'youtubeCache',
    type: SettingsEnum.INTEGER,
    value: '3',
    label: 'Кеш страницы плейлиста, дней',
  },
  {
    option: 'trends',
    section: 'youtubeCache',
    type: SettingsEnum.INTEGER,
    value: '3',
    label: 'Кеш трендов, дней',
  },
  {
    option: 'videoComments',
    section: 'youtubeCache',
    type: SettingsEnum.INTEGER,
    value: '3',
    label: 'Кеш комментариев, дней',
  },
  {
    option: 'categoriesWithVideos',
    section: 'youtubeCache',
    type: SettingsEnum.INTEGER,
    value: '3',
    label: 'Кеш категории с видео (главная страница), дней',
  },
]
