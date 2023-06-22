import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

import { SettingsEnum } from './settings.types'
import { stringToBoolean } from '../../utils'

@Injectable()
export class SettingsResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest()

    if (request.method === 'GET' || request.method === 'POST') {
      return next.handle().pipe(
        map((data) => {
          if (Array.isArray(data)) {
            return data.map((item) => {
              if (item.type === SettingsEnum.BOOLEAN) {
                return { ...item, value: stringToBoolean(item.value) }
              }
              if (item.type === SettingsEnum.INTEGER) {
                return { ...item, value: Number(item.value) }
              }
              if (item.type === SettingsEnum.STRING) {
                return { ...item, value: String(item.value) }
              }
              return item
            })
          }

          return data
        })
      )
    }

    return next.handle().pipe(map((data) => data))
  }
}
