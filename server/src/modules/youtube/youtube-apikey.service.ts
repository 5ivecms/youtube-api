import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { LessThan, Repository } from 'typeorm'

import { YoutubeApikey } from './youtube-apikey.entity'
import {
  CreateBulkYoutubeApikeyDto,
  CreateYoutubeApikeyDto,
  DeleteBulkYoutubeApikeysDto,
  UpdateYoutubeApikeyDto,
} from './dto'
import { SearchService } from '../../common/services/search-service/search.service'
import { MAX_QUOTA } from './constants'

@Injectable()
export class YoutubeApikeyService extends SearchService<YoutubeApikey> {
  constructor(@InjectRepository(YoutubeApikey) private readonly youtubeApikeyRepository: Repository<YoutubeApikey>) {
    super(youtubeApikeyRepository)
  }

  public findAll() {
    return this.youtubeApikeyRepository.find()
  }

  public getNextKey() {
    return this.youtubeApikeyRepository.findOne({
      where: { currentUsage: LessThan(MAX_QUOTA), isActive: true },
      order: { currentUsage: 'ASC' },
    })
  }

  public async findOne(id: number) {
    const apikey = await this.youtubeApikeyRepository.findOneBy({ id })

    if (!apikey) {
      throw new NotFoundException('Apikey not found')
    }

    return apikey
  }

  public create(dto: CreateYoutubeApikeyDto) {
    return this.youtubeApikeyRepository.save(dto)
  }

  public async createBulk(dto: CreateBulkYoutubeApikeyDto) {
    const { apikeys, comment, dailyLimit } = dto
    await Promise.all(
      apikeys.map(async (apikey) => {
        return await this.create({ apikey, comment, dailyLimit })
      })
    )
  }

  public async update(id: number, dto: UpdateYoutubeApikeyDto) {
    return this.youtubeApikeyRepository.update(id, dto)
  }

  public async delete(id: number) {
    return this.youtubeApikeyRepository.delete(id)
  }

  public async deleteBulk(dto: DeleteBulkYoutubeApikeysDto) {
    return this.youtubeApikeyRepository.delete(dto.ids)
  }

  public async clear() {
    return this.youtubeApikeyRepository.clear()
  }

  public setError(id: number, error: string) {
    return this.youtubeApikeyRepository.update(id, { isActive: false, error })
  }

  public updateCurrentUsage(youtubeApiKey: YoutubeApikey, cost: number) {
    const { id, currentUsage } = youtubeApiKey
    return this.youtubeApikeyRepository.update(id, { currentUsage: currentUsage + cost })
  }
}
