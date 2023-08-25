import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, LessThan, Repository } from 'typeorm'

import { YoutubeApikey } from './youtube-apikey.entity'
import {
  CreateBulkYoutubeApikeyDto,
  CreateYoutubeApikeyDto,
  DeleteBulkYoutubeApikeysDto,
  UpdateYoutubeApikeyDto,
} from './dto'
import { SearchService } from '../../common/services/search-service/search.service'
import { MAX_QUOTA } from './constants'
import { QuotaUsageService } from '../quota-usage/quota-usage.service'

@Injectable()
export class YoutubeApikeyService extends SearchService<YoutubeApikey> {
  constructor(
    @InjectRepository(YoutubeApikey) private readonly youtubeApikeyRepository: Repository<YoutubeApikey>,
    private readonly quotaUsageService: QuotaUsageService,
    private dataSource: DataSource
  ) {
    super(youtubeApikeyRepository)
  }

  public findAll() {
    return this.youtubeApikeyRepository.find()
  }

  public async quotaVolume() {
    const { sum } = await this.dataSource
      .getRepository(YoutubeApikey)
      .createQueryBuilder('ytApikey')
      .select('SUM(ytApikey.dailyLimit)', 'sum')
      .where('ytApikey.isActive = :isActive', { isActive: true })
      .getRawOne()
    return Number(sum)
  }

  public async statistic() {
    const total = await this.quotaVolume()
    const { currentUsage } = await this.quotaUsageService.todayUsage()
    return { total, today: currentUsage }
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

  public async updateCurrentUsage(youtubeApiKey: YoutubeApikey, cost: number) {
    const entity = await this.findOne(youtubeApiKey.id)
    entity.currentUsage = entity.currentUsage + cost

    return this.youtubeApikeyRepository.save(entity)
  }

  public resetAllKeys() {
    return this.youtubeApikeyRepository.update({}, { currentUsage: 0 })
  }
}
