import type { ColumnDef, DeepKeys } from '@tanstack/react-table'
import type { PropsWithChildren } from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ANY = any

export type Order = 'asc' | 'desc'
export type Search = Record<string, string>

export type BaseItem = { id: number }

export type ToUrl = {
  toUrl?: string
}

export type DeleteAction = {
  confirm?: boolean
  onDelete?: (dataIndex: number) => void
}

export type ViewAction<T> = ToUrl & {
  onView?: (data: T) => void
}

export type EditAction<T> = ToUrl & {
  onEdit?: (data: T) => void
}

export interface ActionCellOptions<T> {
  deleteAction?: DeleteAction
  editAction?: EditAction<T>
  viewAction?: ViewAction<T>
}

export interface SelectOption {
  label: string
  value: string
}

export interface AsyncSelectOptions {
  loadOptions: (term: string) => Promise<{ label: string; value: string }[]>
}

export type FilterType = 'asyncSelect' | 'display' | 'number' | 'select' | 'text'

export type DataGridFilterDef<T extends BaseItem> = {
  asyncSelectOptions?: AsyncSelectOptions
  name: DeepKeys<T>
  options?: SelectOption[]
  placeholder?: string
  type: FilterType
}

export type FilterOptions = {
  filter: Record<string, string>
  onChangeFilter: (filter: Record<string, string>) => void
}

export type PaginationOptions = {
  limit: number
  onChangePage: (page: number) => void
  page: number
  total: number
}

export type OrderOptions<T> = {
  order: Order
  orderBy: keyof T
  onChangeOrder: (order: Order) => void
  onChangeOrderBy: (orderBy: keyof T) => void
}

export type DataGridProps<T extends BaseItem> = {
  actionCellOptions?: ActionCellOptions<T>
  columns: ColumnDef<T, ANY>[]
  items?: T[]
  loading?: boolean
  onDelete?: (id: number) => void
  onDeleteMany?: (ids: number[]) => void
  paginationOptions?: PaginationOptions
  orderOptions?: OrderOptions<T>
  filters?: DataGridFilterDef<T>[]
  filterOptions?: FilterOptions
}

export type DataGridProviderProps<T extends BaseItem> = PropsWithChildren<DataGridProps<T>>
