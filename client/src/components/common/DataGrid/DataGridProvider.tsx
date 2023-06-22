import type { Column } from '@tanstack/react-table'
import type { ChangeEvent, ReactElement } from 'react'
import { useCallback, useMemo, useState } from 'react'

import { DataGridContext } from './DataGridContext'
import type { BaseItem, DataGridProviderProps } from './types'

const DataGridProvider = <T extends BaseItem>(props: DataGridProviderProps<T>): ReactElement => {
  const { children, columns, ...contextProps } = props
  const [selectedRows, setSelectedRows] = useState<number[]>([])
  const [currentDeleteId, setCurrentDeleteId] = useState<number | undefined>()
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false)
  const [showDeleteManyDialog, setShowDeleteManyDialog] = useState<boolean>(false)

  const handleSelectAll = useCallback(
    (event: ChangeEvent<HTMLInputElement>): void => {
      const { items } = props

      if (event.target.checked) {
        setSelectedRows(items?.map(({ id }) => Number(id)) ?? [])
        return
      }
      setSelectedRows([])
    },
    [props]
  )

  const typedColumns = columns as Column<T>[]

  const contextValue = useMemo(
    () => ({
      ...contextProps,
      columns: typedColumns,
      currentDeleteId,
      handleSelectAll,
      selectedRows,
      setCurrentDeleteId,
      setSelectedRows,
      setShowDeleteDialog,
      setShowDeleteManyDialog,
      showDeleteDialog,
      showDeleteManyDialog,
    }),
    [
      typedColumns,
      contextProps,
      selectedRows,
      setSelectedRows,
      handleSelectAll,
      currentDeleteId,
      setCurrentDeleteId,
      setShowDeleteDialog,
      setShowDeleteManyDialog,
      showDeleteDialog,
      showDeleteManyDialog,
    ]
  )

  return <DataGridContext.Provider value={contextValue}>{children}</DataGridContext.Provider>
}

export default DataGridProvider
