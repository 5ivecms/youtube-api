import { HttpException, HttpStatus } from '@nestjs/common'

export class PlaylistNotFound extends HttpException {
  constructor() {
    super('Playlist not found', HttpStatus.NOT_FOUND)
  }
}
