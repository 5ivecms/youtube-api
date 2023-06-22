import { isBoolean, isBooleanString, isNumber, isNumberString, isString } from 'class-validator'
import * as dot from 'dot-object'
import { ILike } from 'typeorm'

import { SearchDto } from './search.dto'

export const getDefaultResponse = () => ({ items: [], total: 0, page: 1, take: 10 })

export const prepareParams = <T>(object: SearchDto<T>) => {
  let { order, orderBy, page, take, relations, ...where } = object

  orderBy = orderBy || 'id'
  order = (order || 'desc').toUpperCase()

  take = take || 10
  take > 100 ? 100 : take

  page = page || 1
  page < 1 ? 1 : page

  const skip = (page - 1) * take

  let preparedRelations = prepareRelations(relations)
  const preparedWhere = prepareWhere(where)
  const preparedOrder = prepareOrder({ [orderBy]: order })

  return {
    relations: preparedRelations,
    where: preparedWhere,
    order: preparedOrder,
    page,
    take,
    skip,
  }
}

const prepareRelations = (relations?: string) => {
  let preparedRelations = {}

  if (relations !== undefined && relations.length > 0) {
    const relationsParts = relations.split(',')
    preparedRelations = relationsParts
      .filter((item, index) => {
        return !relationsParts.some((otherItem, otherIndex) => {
          return index !== otherIndex && otherItem.includes(item)
        })
      })
      .reduce((acc, item) => ({ ...acc, [item]: true }), {})
  }

  return dot.object(preparedRelations)
}

const prepareWhere = (where: object) => {
  let preparedWhere: Record<string, string | number | boolean> = {}
  Object.keys(where).forEach((key) => {
    if (String(where[key]).length == 0) {
      return
    }

    if (isNumberString(where[key]) || isNumber(where[key])) {
      preparedWhere[key] = Number(where[key])
      return
    }

    if (isBooleanString(where[key]) || isBoolean(where[key])) {
      preparedWhere[key] = Boolean(where[key])
      return
    }

    preparedWhere[key] = where[key]
  })

  preparedWhere = Object.keys(preparedWhere).reduce((acc, key) => {
    if (isString(preparedWhere[key])) {
      return { ...acc, [key]: ILike(`%${preparedWhere[key]}%`) }
    }
    return { ...acc, [key]: preparedWhere[key] }
  }, {})

  return dot.object(preparedWhere)
}

const prepareOrder = (object: object) => dot.object(object)
