import { registerAs } from '@nestjs/config'

export type TokensConfig = {
  accessTokenSecret: string
  refreshTokenSecret: string
  jwtAccessExpiresIn: string
  jwtRefreshExpiresIn: string
}

export default registerAs('tokens', () => ({
  accessTokenSecret: process.env.JWT_ACCESS_SECRET || '123',
  refreshTokenSecret: process.env.JWT_REFRESH_SECRET || '321',
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
}))
