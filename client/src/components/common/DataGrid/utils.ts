import * as dot from 'dot-object'

import type { BaseItem, DataGridFilterDef } from './types'

export const filterParams = (params: Record<string, string>): object => {
  const dotsObj = dot.dot(params) as Record<string, string>

  const filteredParams = Object.keys(dotsObj)
    .filter((item) => dotsObj[item].length > 0)
    .reduce((acc, item) => ({ ...acc, [item]: dotsObj[item].trim() }), {})

  const preparedParams = dot.dot(filteredParams)

  return preparedParams
}

export const getRelations = <T extends BaseItem = BaseItem>(filtersParams: DataGridFilterDef<T>[]): string[] => {
  const relations = filtersParams.reduce((acc: string[], item) => {
    const fieldParts = String(item.name).split('.')
    if (fieldParts.length === 1) {
      return acc
    }

    fieldParts.pop()

    return [...acc, ...fieldParts]
  }, [])
  return relations
}
