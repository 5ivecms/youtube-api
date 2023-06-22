import type { ChangeEvent, Dispatch, SetStateAction } from 'react'
import { createContext } from 'react'

import type { ANY, BaseItem, DataGridProps } from './types'

export type DataGridContextState<T extends BaseItem> = DataGridProps<T> & {
  currentDeleteId: number | undefined
  handleSelectAll: (event: ChangeEvent<HTMLInputElement>) => void
  selectedRows: number[]
  setCurrentDeleteId: Dispatch<SetStateAction<number | undefined>>
  setSelectedRows: Dispatch<SetStateAction<number[]>>
  setShowDeleteDialog: Dispatch<SetStateAction<boolean>>
  setShowDeleteManyDialog: Dispatch<SetStateAction<boolean>>
  showDeleteDialog: boolean
  showDeleteManyDialog: boolean
}

export const DataGridContext = createContext<DataGridContextState<ANY> | undefined>(undefined)
