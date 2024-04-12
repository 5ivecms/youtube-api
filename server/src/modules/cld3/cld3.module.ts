import { Module } from '@nestjs/common'

import { Cld3Provider } from './cld3.provider'
import { Cld3Service } from './cld3.service'

@Module({
  providers: [Cld3Provider, Cld3Service],
  exports: [Cld3Provider, Cld3Service],
})
export class Cld3Module {}
