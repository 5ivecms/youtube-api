import moment from 'moment'

import { DateRange } from './types'

export const getToday = (): DateRange => {
  const startDate = new Date(moment().startOf('day').toISOString())
  const endDate = new Date(moment().endOf('day').toISOString())

  return { startDate, endDate }
}

export const getYesterday = (): DateRange => {
  const startDate = new Date(moment().add(-1, 'day').toISOString())
  const endDate = new Date(moment().add(-1, 'day').toISOString())

  return { startDate, endDate }
}

export const getThisWeek = (): DateRange => {
  const startDate = new Date(moment().startOf('week').toISOString())
  const endDate = new Date(moment().endOf('week').toISOString())

  return { startDate, endDate }
}

export const getThisMonth = (): DateRange => {
  const startDate = new Date(moment().startOf('month').toISOString())
  const endDate = new Date(moment().endOf('month').toISOString())
  return { startDate, endDate }
}

export const getThisQuarter = (): DateRange => {
  const startDate = new Date(moment().startOf('quarter').toISOString())
  const endDate = new Date(moment().endOf('quarter').toISOString())
  return { startDate, endDate }
}

export const getThisYear = (): DateRange => {
  const startDate = new Date(moment().startOf('year').toISOString())
  const endDate = new Date(moment().endOf('year').toISOString())
  return { startDate, endDate }
}

export const getLastWeek = (): DateRange => {
  const lastWeek = moment().subtract(1, 'week')
  const startDate = new Date(moment(lastWeek).startOf('week').toISOString())
  const endDate = new Date(moment(lastWeek).endOf('week').toISOString())
  return { startDate, endDate }
}

export const getLastMonth = (): DateRange => {
  const lastMonth = moment().subtract(1, 'month')
  const startDate = new Date(moment(lastMonth).startOf('month').toISOString())
  const endDate = new Date(moment(lastMonth).endOf('month').toISOString())
  return { startDate, endDate }
}

export const getLastQuarter = (): DateRange => {
  const lastQuarter = moment().subtract(1, 'quarter')
  const startDate = new Date(moment(lastQuarter).startOf('quarter').toISOString())
  const endDate = new Date(moment(lastQuarter).endOf('quarter').toISOString())
  return { startDate, endDate }
}

export const getLastYear = (): DateRange => {
  const lastYear = moment().subtract(1, 'year')
  const startDate = new Date(moment(lastYear).startOf('year').toISOString())
  const endDate = new Date(moment(lastYear).endOf('year').toISOString())
  return { startDate, endDate }
}

export const checkRange = ({ startDate, endDate }: DateRange) => {
  const yesterday = moment().add(-1, 'day')
  const isYesterday = moment(startDate).isSame(yesterday, 'day') && moment(endDate).isSame(yesterday, 'day')
  if (isYesterday) {
    return 'yesterday'
  }

  const startToday = moment().startOf('day')
  const endToday = moment().endOf('day')
  const isToday = moment(startDate).isSame(startToday, 'day') && moment(endDate).isSame(endToday, 'day')
  if (isToday) {
    return 'today'
  }

  const tomorrow = moment().add(1, 'day')
  const isTomorrow = moment(startDate).isSame(tomorrow, 'day') && moment(endDate).isSame(tomorrow, 'day')
  if (isTomorrow) {
    return 'tomorrow'
  }

  const thisWeekStart = moment().startOf('week')
  const thisWeekEnd = moment().endOf('week')
  const isThisWeek = moment(startDate).isSame(thisWeekStart, 'day') && moment(endDate).isSame(thisWeekEnd, 'day')
  if (isThisWeek) {
    return 'thisWeek'
  }

  const startThisMonth = moment().startOf('month')
  const endThisMonth = moment().endOf('month')
  const isThisMonth = moment(startDate).isSame(startThisMonth, 'day') && moment(endDate).isSame(endThisMonth, 'day')
  if (isThisMonth) {
    return 'thisMonth'
  }

  const startThisQuarter = moment().startOf('quarter')
  const endThisQuarter = moment().endOf('quarter')
  const isThisQuarter =
    moment(startDate).isSame(startThisQuarter, 'day') && moment(endDate).isSame(endThisQuarter, 'day')
  if (isThisQuarter) {
    return 'thisQuarter'
  }

  const startThisYear = moment().startOf('year')
  const endThisYear = moment().endOf('year')
  const isThisYear = moment(startDate).isSame(startThisYear, 'day') && moment(endDate).isSame(endThisYear, 'day')
  if (isThisYear) {
    return 'thisYear'
  }

  const lastWeek = moment().subtract(1, 'week')
  const isLastWeek = moment(startDate).isSame(lastWeek, 'day') && moment(endDate).isSame(lastWeek, 'day')
  if (isLastWeek) {
    return 'lastWeek'
  }

  const lastMonth = moment().subtract(1, 'month')
  const isLastMonth = moment(startDate).isSame(lastMonth, 'day') && moment(endDate).isSame(lastMonth, 'day')
  if (isLastMonth) {
    return 'lastMonth'
  }

  const lastQuarter = moment().subtract(1, 'quarter')
  const isLastQuarter = moment(startDate).isSame(lastQuarter, 'day') && moment(endDate).isSame(lastQuarter, 'day')
  if (isLastQuarter) {
    return 'lastQuarter'
  }

  const lastYear = moment().subtract(1, 'year')
  const isLastYear = moment(startDate).isSame(lastYear, 'day') && moment(endDate).isSame(lastYear, 'day')
  if (isLastYear) {
    return 'lastYear'
  }

  return ''
}
