import { StaticRange } from 'react-date-range'

import {
  checkRange,
  getLastMonth,
  getLastQuarter,
  getLastWeek,
  getLastYear,
  getThisMonth,
  getThisQuarter,
  getThisWeek,
  getThisYear,
  getToday,
  getYesterday,
} from './utils'

export const staticRanges: StaticRange[] = [
  {
    label: 'Сегодня',
    range: getToday,
    isSelected({ startDate, endDate }) {
      if (!startDate || !endDate) {
        return false
      }
      return checkRange({ startDate, endDate }) === 'today'
    },
  },
  {
    label: 'Вчера',
    range: getYesterday,
    isSelected({ startDate, endDate }) {
      if (!startDate || !endDate) {
        return false
      }
      return checkRange({ startDate, endDate }) === 'yesterday'
    },
  },
  {
    label: 'Текущая неделя',
    range: getThisWeek,
    isSelected({ startDate, endDate }) {
      if (!startDate || !endDate) {
        return false
      }
      return checkRange({ startDate, endDate }) === 'thisWeek'
    },
  },
  {
    label: 'Текущий месяц',
    range: getThisMonth,
    isSelected({ startDate, endDate }) {
      if (!startDate || !endDate) {
        return false
      }
      return checkRange({ startDate, endDate }) === 'thisMonth'
    },
  },
  {
    label: 'Текущий квартал',
    range: getThisQuarter,
    isSelected({ startDate, endDate }) {
      if (!startDate || !endDate) {
        return false
      }
      return checkRange({ startDate, endDate }) === 'thisQuarter'
    },
  },
  {
    label: 'Текущий год',
    range: getThisYear,
    isSelected({ startDate, endDate }) {
      if (!startDate || !endDate) {
        return false
      }
      return checkRange({ startDate, endDate }) === 'thisYear'
    },
  },
  {
    label: 'Последняя неделя',
    range: getLastWeek,
    isSelected({ startDate, endDate }) {
      if (!startDate || !endDate) {
        return false
      }
      return checkRange({ startDate, endDate }) === 'lastWeek'
    },
  },
  {
    label: 'Последний месяц',
    range: getLastMonth,
    isSelected({ startDate, endDate }) {
      if (!startDate || !endDate) {
        return false
      }
      return checkRange({ startDate, endDate }) === 'lastMonth'
    },
  },
  {
    label: 'Последний квартал',
    range: getLastQuarter,
    isSelected({ startDate, endDate }) {
      if (!startDate || !endDate) {
        return false
      }
      return checkRange({ startDate, endDate }) === 'lastQuarter'
    },
  },
  {
    label: 'Последний год',
    range: getLastYear,
    isSelected({ startDate, endDate }) {
      if (!startDate || !endDate) {
        return false
      }
      return checkRange({ startDate, endDate }) === 'lastYear'
    },
  },
]
