import type { ReactElement } from 'react'

import { useDataGridContext } from '../../hooks/useDataGrid'
import type { BaseItem } from '../../types'
import DataGridDialog from '../DataGridDialog/DataGridDialog'

const DataGridDialogs = <T extends BaseItem>(): ReactElement => {
  const {
    onDelete,
    onDeleteMany,
    currentDeleteId,
    showDeleteDialog,
    setShowDeleteDialog,
    setCurrentDeleteId,
    showDeleteManyDialog,
    setShowDeleteManyDialog,
    setSelectedRows,
    selectedRows,
  } = useDataGridContext<T>()

  const handleConfirmDelete = (): void => {
    if (onDelete !== undefined && currentDeleteId !== undefined) {
      onDelete(currentDeleteId)
      setCurrentDeleteId(0)
      setShowDeleteDialog(false)
    }
  }

  const handleConfirmDeleteMany = (): void => {
    if (onDeleteMany !== undefined) {
      onDeleteMany(selectedRows)
      setSelectedRows([])
      setShowDeleteManyDialog(false)
    }
  }

  return (
    <>
      <DataGridDialog
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
        open={showDeleteDialog}
        text="Вы уверены, что хотите удалить запись?"
        title="Удаление записи"
      />
      <DataGridDialog
        onClose={() => setShowDeleteManyDialog(false)}
        onConfirm={handleConfirmDeleteMany}
        open={showDeleteManyDialog}
        text="Вы уверены, что хотите удалить выбранные записи?"
        title="Удаление записей"
      />
    </>
  )
}

export default DataGridDialogs
