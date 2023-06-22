import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule } from '@nestjs/config'

import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { UserModule } from '../user/user.module'
import { AccessTokenStrategy, RefreshTokenStrategy } from './strategies'
import { HeaderApiKeyStrategy } from './strategies/headerApiKey.strategy'
import { ApiKeyModule } from '../api-key/api-key.module'

@Module({
  imports: [JwtModule.register({}), UserModule, ConfigModule, ApiKeyModule],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy, HeaderApiKeyStrategy],
})
export class AuthModule {}
