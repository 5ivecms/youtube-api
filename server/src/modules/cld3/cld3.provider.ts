import { Injectable, OnModuleDestroy } from '@nestjs/common'
import { LanguageIdentifier, loadModule } from 'cld3-asm'

@Injectable()
export class Cld3Provider implements OnModuleDestroy {
  public languageIdentifier: LanguageIdentifier

  constructor() {
    this.initialize().then()
  }

  private async initialize(): Promise<void> {
    const cldFactory = await loadModule()
    const languageIdentifier = cldFactory.create(0, 2000)
    this.languageIdentifier = languageIdentifier
  }

  onModuleDestroy() {
    this.languageIdentifier.dispose()
  }
}
