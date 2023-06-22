import type { Context } from 'react'
import { useContext } from 'react'

import type { DataGridContextState } from '../DataGridContext'
import { DataGridContext } from '../DataGridContext'
import type { BaseItem } from '../types'

export const useDataGridContext = <T extends BaseItem>(): DataGridContextState<T> => {
  const context = useContext(DataGridContext as unknown as Context<DataGridContextState<T>>)
  if (context === undefined) {
    throw new Error('useDataGridContext must be within DataGridProvider')
  }

  return context
}
