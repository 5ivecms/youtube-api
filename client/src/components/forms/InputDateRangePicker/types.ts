export type DatePreiodType =
  | 'today'
  | 'yesterday'
  | 'tomorrow'
  | 'thisWeek'
  | 'thisMonth'
  | 'thisQuarter'
  | 'thisYear'
  | 'lastWeek'
  | 'lastMonth'
  | 'lastQuarter'
  | 'lastYear'

export type DateRange = {
  startDate: Date
  endDate: Date
}
