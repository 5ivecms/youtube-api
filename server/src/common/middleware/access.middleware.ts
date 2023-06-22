import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response } from 'express'

import { SettingsService } from '../../modules/settings/settings.service'

@Injectable()
export class AccessMiddleware implements NestMiddleware {
  constructor(private readonly settingsService: SettingsService) {}

  public async use(req: Request, res: Response, next: Function) {
    /* const { ip, hostname } = req
    const { hosts, ips } = await this.settingsService.getAccessSettings()

    if (!ips.includes(ip) || !hosts.includes(hostname)) {
      res.status(403).send('Forbidden')
      return
    } */

    next()
  }
}
