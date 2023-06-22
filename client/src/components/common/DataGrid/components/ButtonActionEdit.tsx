import { Edit } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import type { ReactElement } from 'react'
import { Link } from 'react-router-dom'

import { EDIT_URL_PATH } from '../data-grid.config'
import { useDataGridContext } from '../hooks/useDataGrid'
import type { BaseItem } from '../types'

interface ButtonActionEditProps<T> {
  item: T
}

const ButtonActionEdit = <T extends BaseItem>({ item }: ButtonActionEditProps<T>): ReactElement => {
  const { actionCellOptions } = useDataGridContext<T>()

  const editAction = actionCellOptions ? actionCellOptions.editAction : undefined

  if (editAction !== undefined && editAction?.onEdit !== undefined) {
    const { onEdit } = editAction
    return (
      <IconButton color="success" onClick={() => onEdit(item)}>
        <Edit />
      </IconButton>
    )
  }

  const toUrl = `${editAction?.toUrl ?? EDIT_URL_PATH}/${item.id}`

  return (
    <IconButton color="success" component={Link} to={toUrl}>
      <Edit />
    </IconButton>
  )
}

export default ButtonActionEdit
