import { DataSource, DataSourceOptions } from 'typeorm'

import { ApiKeyEntity } from '../api-key/api-key.entity'
import { DomainEntity } from '../domain/domain.entity'
import { ProxyEntity } from '../proxy/proxy.entity'
import { QuotaUsageEntity } from '../quota-usage/quota-usage.entity'
import { SafeWordEntity } from '../safe-word/safe-word.entity'
import { SettingsEntity } from '../settings/settings.entity'
import { User } from '../user/entities/user.entity'
import { UseragentEntity } from '../useragent/useragent.entity'
import { VideoBlacklistEntity } from '../video-blacklist/video-blacklist.entity'
import { YoutubeApikey } from '../youtube/youtube-apikey.entity'

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [
    ProxyEntity,
    UseragentEntity,
    SafeWordEntity,
    SettingsEntity,
    User,
    DomainEntity,
    ApiKeyEntity,
    YoutubeApikey,
    VideoBlacklistEntity,
    QuotaUsageEntity,
  ],
  synchronize: true,
}

export default new DataSource(dataSourceOptions)
// asd
// asd
