import { Injectable } from '@nestjs/common'

import { Cld3Provider } from './cld3.provider'

@Injectable()
export class Cld3Service {
  constructor(private readonly cld3Provider: Cld3Provider) {}

  public detect(text: string) {
    return this.cld3Provider.languageIdentifier.findLanguage(text)
  }
}
