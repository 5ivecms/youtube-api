import { Module } from '@nestjs/common'

import { InvidiousModule } from '../invidious/invidious.module'
import { InvidiousParserController } from './invidious-parser.controller'
import { InvidiousParserService } from './invidious-parser.service'
import { UseragentModule } from '../useragent/useragent.module'
import { SafeWordModule } from '../safe-word/safe-word.module'
import { SettingsModule } from '../settings/settings.module'
import { ProxyModule } from '../proxy/proxy.module'

@Module({
  imports: [InvidiousModule, UseragentModule, SafeWordModule, SettingsModule, ProxyModule],
  controllers: [InvidiousParserController],
  providers: [InvidiousParserService],
})
export class InvidiousParserModule {}
