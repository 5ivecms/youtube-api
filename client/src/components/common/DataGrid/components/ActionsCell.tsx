import { Delete } from '@mui/icons-material'
import { IconButton, Stack } from '@mui/material'
import type { ReactElement } from 'react'

import { useDataGridContext } from '../hooks/useDataGrid'
import type { ActionCellOptions, BaseItem } from '../types'
import ButtonActionEdit from './ButtonActionEdit'
import ButtonActionView from './ButtonActionView'

export interface ActionsCellProps<T extends BaseItem = BaseItem> extends ActionCellOptions<T> {
  item: T
}

const ActionsCell = <T extends BaseItem>({ item }: ActionsCellProps<T>): ReactElement => {
  const { onDelete, setCurrentDeleteId, setShowDeleteDialog } = useDataGridContext<T>()

  const handleDelete = (): void => {
    setCurrentDeleteId(item.id)
    setShowDeleteDialog(true)
  }

  return (
    <Stack direction="row" spacing={0}>
      <ButtonActionView item={item} />
      <ButtonActionEdit item={item} />
      {onDelete !== undefined && (
        <IconButton color="error" onClick={handleDelete}>
          <Delete />
        </IconButton>
      )}
    </Stack>
  )
}

export default ActionsCell
