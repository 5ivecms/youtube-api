import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import Strategy from 'passport-headerapikey'
import { ApiKeyService } from 'src/modules/api-key/api-key.service'

@Injectable()
export class HeaderApiKeyStrategy extends PassportStrategy(Strategy, 'api-key') {
  constructor(private readonly apiKeyService: ApiKeyService) {
    super({ header: 'X-API-KEY', prefix: '' }, true, async (apiKey, done) => {
      return this.validate(apiKey, done)
    })
  }

  public async validate(apiKey: string, done: (error: Error, data) => {}) {
    try {
      const existApiKey = await this.apiKeyService.findOneBy({ apiKey })

      if (existApiKey) {
        done(null, true)
      }
      done(new UnauthorizedException(), null)
    } catch (e) {
      done(new UnauthorizedException(), null)
    }
  }
}
