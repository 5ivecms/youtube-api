import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { InvidiousLogsEntity } from './invidious-logs.entity'
import { CreateInvidiousLogsDto } from './dto'

@Injectable()
export class InvidiousLogsService {
  constructor(
    @InjectRepository(InvidiousLogsEntity) private readonly invidiousLogsRepository: Repository<InvidiousLogsEntity>
  ) {}

  public findAll() {
    try {
      return this.invidiousLogsRepository.find()
    } catch (e) {
      throw new InternalServerErrorException(e)
    }
  }

  public getLogsByInvidiousId(invidiousId: number) {
    return this.invidiousLogsRepository.find({ where: { invidiousId }, order: { id: 'DESC' } })
  }

  public create(dto: CreateInvidiousLogsDto) {
    try {
      return this.invidiousLogsRepository.save(dto)
    } catch (e) {
      throw new InternalServerErrorException(e)
    }
  }

  public clear() {
    try {
      return this.invidiousLogsRepository.clear()
    } catch (e) {
      throw new InternalServerErrorException(e)
    }
  }
}
