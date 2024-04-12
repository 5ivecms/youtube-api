import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import * as Joi from 'joi'
import { RedisModule } from '@liaoliaots/nestjs-redis'
import { DataSource } from 'typeorm'
import { ScheduleModule } from '@nestjs/schedule'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { baseUser, cacheConfig, databaseConfig, serverConfig, settingsConfig, tokensConfig } from './config'
import { DatabaseModule } from './modules/database/database.module'
import { ProxyModule } from './modules/proxy/proxy.module'
import { UseragentModule } from './modules/useragent/useragent.module'
import { SafeWordModule } from './modules/safe-word/safe-word.module'
import { SettingsModule } from './modules/settings/settings.module'
import { UserModule } from './modules/user/user.module'
import { AuthModule } from './modules/auth/auth.module'
import { DomainModule } from './modules/domain/domain.module'
import { ApiKeyModule } from './modules/api-key/api-key.module'
import { YoutubeModule } from './modules/youtube/youtube.module'
import { VideoBlacklistModule } from './modules/video-blacklist/video-blacklist.module'
import { QuotaUsageModule } from './modules/quota-usage/quota-usage.module'
import { CronModule } from './modules/cron/cron.module'
import { ChannelBlacklistModule } from './modules/channel-blacklist/channel-blacklist.module'
import { Cld3Module } from './modules/cld3/cld3.module'
import { AppOnlineMiddleware } from './common/middleware/api-online.middleware'
import { SettingsService } from './modules/settings/settings.service'

const ENV = process.env.NODE_ENV ?? 'development'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${ENV}`,
      load: [databaseConfig, serverConfig, settingsConfig, tokensConfig, baseUser, cacheConfig],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'production').default('development'),
        PORT: Joi.number().default(5000),
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),

        SETTINGS_INVIDIOUS_TIMEOUT: Joi.string().default('2000'),
        SETTINGS_INVIDIOUS_PROXY: Joi.string().default('0'),
        SETTINGS_ACCESS_HOSTS: Joi.string().allow('').default(''),
        SETTINGS_ACCESS_IPS: Joi.string().allow('').default(''),

        JWT_ACCESS_SECRET: Joi.string().required(),
        JWT_REFRESH_SECRET: Joi.string().required(),
        JWT_ACCESS_EXPIRES_IN: Joi.string().required(),
        JWT_REFRESH_EXPIRES_IN: Joi.string().required(),

        BASE_USER_EMAIL: Joi.string().required(),
        BASE_USER_PASSWORD: Joi.string().required(),

        API_KEY_CACHE_TTL: Joi.number().default(86400000),
        DOMAINS_CACHE_TTL: Joi.number().default(86400000),
        INVIDIOUS_CACHE_TTL: Joi.number().default(86400000),
        PROXY_CACHE_TTL: Joi.number().default(86400000),
        SAFE_WORDS_CACHE_TTL: Joi.number().default(86400000),
        SETTINGS_CACHE_TTL: Joi.number().default(86400000),
        USERAGENTS_CACHE_TTL: Joi.number().default(86400000),
        VIDEO_BLACKLIST_CACHE_TTL: Joi.number().default(86400000),

        SETTINGS_APP_ENABLED: Joi.number().default(0),
        SETTINGS_API_KEY_PER_PROXY_LIMIT: Joi.number().default(5),
        SETTINGS_PARSER_SAVE_VIDEO_DESCRIPTION: Joi.number().default(0),

        YOUTUBE_SEARCH_CACHE_DAYS: Joi.number().default(3),
        YOUTUBE_CATEGORIES_CACHE_DAYS: Joi.number().default(3),
        YOUTUBE_VIDEO_BY_ID_CACHE_DAYS: Joi.number().default(3),
        YOUTUBE_VIDEO_BY_CATEGORY_ID_CACHE_DAYS: Joi.number().default(3),
        YOUTUBE_VIDEO_BY_CHANNEL_ID_CACHE_DAYS: Joi.number().default(3),
        YOUTUBE_VIDEO_BY_PLAYLIST_ID_CACHE_DAYS: Joi.number().default(3),
        YOUTUBE_COMMENTS_CACHE_DAYS: Joi.number().default(3),
        YOUTUBE_TRENDS_CACHE_DAYS: Joi.number().default(3),
        YOUTUBE_CATEGORIES_WITH_VIDEOS: Joi.number().default(3),
      }),
    }),
    RedisModule.forRoot({
      config: [
        { url: 'redis://redis2:6377' },
        {
          namespace: 'youtube-api',
          url: 'redis://redis:6379',
          db: 0,
        },
        {
          namespace: 'youtube-api-channels',
          url: 'redis://redis:6379',
          db: 1,
        },
        {
          namespace: 'youtube-api-videos',
          url: 'redis://redis:6379',
          db: 2,
        },
        {
          namespace: 'youtube-api-search',
          url: 'redis://redis:6379',
          db: 3,
        },
        {
          namespace: 'youtube-api-comments',
          url: 'redis://redis:6379',
          db: 4,
        },
        {
          namespace: 'youtube-api-playlists',
          url: 'redis://redis:6379',
          db: 5,
        },
      ],
    }),
    ScheduleModule.forRoot(),
    DatabaseModule,
    ProxyModule,
    UseragentModule,
    SafeWordModule,
    SettingsModule,
    UserModule,
    AuthModule,
    DomainModule,
    ApiKeyModule,
    YoutubeModule,
    VideoBlacklistModule,
    ChannelBlacklistModule,
    QuotaUsageModule,
    CronModule,
    Cld3Module,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  constructor(private dataSource: DataSource, private readonly settingsService: SettingsService) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply((req, res, next) => new AppOnlineMiddleware(this.settingsService).use(req, res, next)).forRoutes('*')
  }
}
