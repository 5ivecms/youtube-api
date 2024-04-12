import { HttpException, HttpStatus, NestMiddleware } from '@nestjs/common'
import { Request, Response } from 'express'

import { SettingsService } from '../../modules/settings/settings.service'

export class AppOnlineMiddleware implements NestMiddleware {
  constructor(private readonly settingsService: SettingsService) {}

  async use(req: Request, res: Response, next: Function) {
    const settings = await this.settingsService.getAppSettings()

    if (!settings.enabled && req.baseUrl.indexOf('api/youtube/api') !== -1) {
      throw new HttpException('Сервис временно недоступен', HttpStatus.SERVICE_UNAVAILABLE)
    }

    next()
  }
}
