import { Injectable, BadRequestException, ForbiddenException, OnModuleInit } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import * as argon2 from 'argon2'

import { UserService } from '../user/user.service'
import { CreateUserDto } from '../user/dto'
import { TokensConfig } from '../../config/tokens.config'
import { BaseUserConfig } from '../../config/base-user.config'
import { AuthDto, ChangePasswordDto } from './dto'

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  public async onModuleInit() {
    const user = this.configService.get<BaseUserConfig>('baseUser')
    const userExist = await this.usersService.findByEmail(user.email)
    if (userExist) {
      return
    }

    const password = await this.hashData(user.password)
    await this.usersService.create({ password, email: user.email })
  }

  public async signUp(createUserDto: CreateUserDto) {
    const userExists = await this.usersService.findByEmail(createUserDto.email)
    if (userExists) {
      throw new BadRequestException('User already exists')
    }

    const hash = await this.hashData(createUserDto.password)
    const newUser = await this.usersService.create({ ...createUserDto, password: hash })

    const tokens = await this.getTokens(newUser.id, newUser.email)
    await this.updateRefreshToken(newUser.id, tokens.refreshToken)

    return tokens
  }

  public async signIn(data: AuthDto) {
    const user = await this.usersService.findByEmail(data.email)
    if (!user) {
      throw new BadRequestException('User does not exist')
    }

    const passwordMatches = await argon2.verify(user.password, data.password)
    if (!passwordMatches) {
      throw new BadRequestException('Password is incorrect')
    }

    const tokens = await this.getTokens(user.id, user.email)
    await this.updateRefreshToken(user.id, tokens.refreshToken)

    const { password, refreshToken, ...userFields } = user

    return { user: userFields, tokens }
  }

  public async changePassword(
    dto: ChangePasswordDto,
    userId: number
  ): Promise<{
    accessToken: string
    refreshToken: string
  }> {
    const { oldPassword, newPassword } = dto
    const user = await this.usersService.findById(Number(userId))
    if (!user || !user.refreshToken) {
      throw new ForbiddenException('Access Denied')
    }

    const oldPasswordMatches = await argon2.verify(user.password, oldPassword)
    if (!oldPasswordMatches) {
      throw new BadRequestException('Старый пароль введен неверно')
    }

    const newPasswordHash = await this.hashData(newPassword)

    await this.usersService.update(userId, { ...user, password: newPasswordHash })
    const tokens = await this.getTokens(user.id, user.email)
    await this.updateRefreshToken(user.id, tokens.refreshToken)

    return tokens
  }

  public async logout(userId: number) {
    return this.usersService.update(userId, { refreshToken: null })
  }

  public hashData(data: string) {
    return argon2.hash(data)
  }

  public async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken)
    await this.usersService.update(userId, { refreshToken: hashedRefreshToken })
  }

  public async getTokens(userId: number, email: string) {
    const { accessTokenSecret, refreshTokenSecret, jwtAccessExpiresIn, jwtRefreshExpiresIn } =
      this.configService.get<TokensConfig>('tokens')
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync({ sub: userId, email }, { secret: accessTokenSecret, expiresIn: jwtAccessExpiresIn }),
      this.jwtService.signAsync({ sub: userId, email }, { secret: refreshTokenSecret, expiresIn: jwtRefreshExpiresIn }),
    ])

    return { accessToken, refreshToken }
  }

  public async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.usersService.findById(Number(userId))
    if (!user || !user.refreshToken) {
      throw new ForbiddenException('Access Denied')
    }

    const refreshTokenMatches = await argon2.verify(user.refreshToken, refreshToken)
    if (!refreshTokenMatches) {
      throw new ForbiddenException('Access Denied')
    }

    const tokens = await this.getTokens(user.id, user.email)
    await this.updateRefreshToken(user.id, tokens.refreshToken)

    return tokens
  }
}
