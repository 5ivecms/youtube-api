import { Visibility } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import type { ReactElement } from 'react'
import { Link } from 'react-router-dom'

import { VIEW_URL_PATH } from '../data-grid.config'
import { useDataGridContext } from '../hooks/useDataGrid'
import type { BaseItem } from '../types'

interface ButtonActionViewProps<T> {
  item: T
}

const ButtonActionView = <T extends BaseItem>({ item }: ButtonActionViewProps<T>): ReactElement => {
  const { actionCellOptions } = useDataGridContext<T>()

  const viewAction = actionCellOptions ? actionCellOptions.viewAction : undefined

  if (viewAction !== undefined && viewAction.onView !== undefined) {
    const { onView } = viewAction
    return (
      <IconButton color="primary" onClick={() => onView(item)}>
        <Visibility />
      </IconButton>
    )
  }

  const toUrl = `${viewAction?.toUrl ?? VIEW_URL_PATH}/${item.id}`

  return (
    <IconButton color="primary" component={Link} to={toUrl}>
      <Visibility />
    </IconButton>
  )
}

export default ButtonActionView
