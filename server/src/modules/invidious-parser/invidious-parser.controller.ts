import { Controller, Get, Query, Param, Post, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

import { GetVideoDto, SearchVideoDto } from './dto'
import { InvidiousParserService } from './invidious-parser.service'

@Controller('invidious-parser')
export class InvidiousParserController {
  constructor(private readonly invidiousParserService: InvidiousParserService) {}

  @UseGuards(AuthGuard(['api-key', 'jwt']))
  @Get('get-video')
  public getVideo(@Query() dto: GetVideoDto) {
    return this.invidiousParserService.getVideo(dto)
  }

  @UseGuards(AuthGuard(['api-key', 'jwt']))
  @Get('get-trending')
  public getTrending() {
    return this.invidiousParserService.getTrending()
  }

  @UseGuards(AuthGuard(['api-key', 'jwt']))
  @Get('get-popular')
  public getPopular() {
    return this.invidiousParserService.getPopular()
  }

  @UseGuards(AuthGuard(['api-key', 'jwt']))
  @Get('search')
  public search(@Query() dto: SearchVideoDto) {
    return this.invidiousParserService.search(dto)
  }

  @UseGuards(AuthGuard(['api-key', 'jwt']))
  @Post('load-hosts')
  public loadHosts() {
    return this.invidiousParserService.loadHosts()
  }

  @UseGuards(AuthGuard(['jwt']))
  @Post('health-check/:id')
  public healthCheck(@Param('id') id: number) {
    return this.invidiousParserService.healthCheck(+id)
  }

  @UseGuards(AuthGuard(['jwt']))
  @Post('health-check-all')
  public healthCheckAll() {
    return this.invidiousParserService.healthCheckAll()
  }
}
