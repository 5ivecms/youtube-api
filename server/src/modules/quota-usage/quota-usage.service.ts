import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Between, Repository } from 'typeorm'

import { QuotaUsageEntity } from './quota-usage.entity'
import { CreateOrUpdateQuotaUsageDto, QuotaUsageByPeriodDto } from './dto'
import { getDatesArray, randomIntFromInterval } from '../../utils'

@Injectable()
export class QuotaUsageService {
  constructor(
    @InjectRepository(QuotaUsageEntity) private readonly quotaUsageRepository: Repository<QuotaUsageEntity>
  ) {}

  public findAll(): Promise<QuotaUsageEntity[]> {
    return this.quotaUsageRepository.find({ order: { date: 'ASC' } })
  }

  public async addUsage(dto: CreateOrUpdateQuotaUsageDto): Promise<QuotaUsageEntity> {
    const { currentUsage } = dto
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    let usageData = await this.quotaUsageRepository.findOneBy({ date: today })

    if (!usageData) {
      usageData = new QuotaUsageEntity()
      usageData.date = today
      usageData.currentUsage = 0
    }

    usageData.currentUsage += currentUsage

    return this.quotaUsageRepository.save(usageData)
  }

  public async forDate(date: Date): Promise<QuotaUsageEntity> {
    return this.quotaUsageRepository.findOneBy({ date })
  }

  public async byPeriod(dto: QuotaUsageByPeriodDto): Promise<QuotaUsageEntity[]> {
    const { startDate, endDate } = dto
    return await this.quotaUsageRepository.find({
      where: { date: Between(startDate, endDate) },
      order: { date: 'ASC' },
    })
  }

  public async todayUsage() {
    return await this.addUsage({ currentUsage: 0 })
  }

  public async fillDb() {
    const datesArray = getDatesArray()
    await Promise.all(
      datesArray.map(async (today) => {
        let usageData = await this.quotaUsageRepository.findOneBy({ date: today })

        if (!usageData) {
          usageData = new QuotaUsageEntity()
          usageData.date = today
          usageData.currentUsage = 0
        }

        usageData.currentUsage += randomIntFromInterval(0, 10000)

        return this.quotaUsageRepository.save(usageData)
      })
    )
  }
}
