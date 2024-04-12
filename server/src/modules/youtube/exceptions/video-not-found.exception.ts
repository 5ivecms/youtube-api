import { HttpCode, HttpException, HttpStatus } from '@nestjs/common'

export class VideoNotFound extends HttpException {
  constructor() {
    super('Video not Found', HttpStatus.NOT_FOUND)
  }
}
