import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

import { InvidiousEntity } from '../invidious/invidious.entity'
import { ProxyEntity } from '../proxy/proxy.entity'
import { UseragentEntity } from '../useragent/useragent.entity'
import { SafeWordEntity } from '../safe-word/safe-word.entity'
import { InvidiousLogsEntity } from '../invidious/invidious-logs.entity'
import { SettingsEntity } from '../settings/settings.entity'
import { User } from '../user/entities/user.entity'
import { DomainEntity } from '../domain/domain.entity'
import { ApiKeyEntity } from '../api-key/api-key.entity'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: configService.get('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB'),
        //entities: ['dist/**/*.entity.{ts,js}'],
        entities: [
          InvidiousEntity,
          ProxyEntity,
          UseragentEntity,
          SafeWordEntity,
          InvidiousLogsEntity,
          SettingsEntity,
          User,
          DomainEntity,
          ApiKeyEntity,
        ],
        synchronize: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
