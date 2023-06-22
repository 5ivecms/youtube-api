/* eslint-disable react/jsx-key */
import { Checkbox, TableCell, TableRow } from '@mui/material'
import type { Row } from '@tanstack/react-table'
import { flexRender } from '@tanstack/react-table'
import type { MouseEvent, ReactElement } from 'react'
import { memo } from 'react'

import type { BaseItem } from '../../types'
import ActionsCell from '../ActionsCell'

interface DataGridRowProps<T> {
  onSelectRow: (id: number) => (_: MouseEvent<HTMLButtonElement>) => void
  row: Row<T>
  selected: boolean
}

const DataGridRow = <T extends BaseItem>({ selected, row, onSelectRow }: DataGridRowProps<T>): ReactElement => {
  return (
    <TableRow selected={selected} hover>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} color="primary" onClick={onSelectRow(Number(row.original.id))} />
      </TableCell>
      {row.getVisibleCells().map((cell) => (
        <TableCell
          {...{
            key: cell.id,
            style: { width: cell.column.getSize() },
          }}
        >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
      <TableCell>
        <ActionsCell item={row.original} />
      </TableCell>
    </TableRow>
  )
}

export default memo(DataGridRow)
