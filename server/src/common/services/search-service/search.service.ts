import type { Repository } from 'typeorm'

import type { SearchDto } from './search.dto'
import { getDefaultResponse, prepareParams } from './utils'

export class SearchService<T> {
  constructor(private readonly repository: Repository<T>) {}

  public async search(dto: SearchDto<T>) {
    try {
      const { take, skip, order, page, relations, where } = prepareParams(dto)

      const [items, total] = await this.repository.findAndCount({
        relations,
        where,
        skip,
        take,
        order,
      })

      return { items, total, page, take }
    } catch (e) {
      return getDefaultResponse()
    }
  }
}
