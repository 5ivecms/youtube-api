import { Checkbox, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material'
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import type { MouseEvent, ReactElement } from 'react'

import { useDataGridContext } from '../hooks/useDataGrid'
import type { BaseItem } from '../types'
import ActionsCell from './ActionsCell'
import DataGridFilter from './DataGridFilter'
import { DataGridPagination } from './DataGridPagination'
import DataGridTableHead from './DataGridTableHead'

const DataGridTable = <T extends BaseItem = BaseItem>(): ReactElement => {
  const { columns, items, selectedRows, setSelectedRows } = useDataGridContext<T>()

  const table = useReactTable<T>({
    columns,
    data: items ?? [],
    getCoreRowModel: getCoreRowModel(),
  })

  const isSelected = (id: number) => selectedRows.includes(id)

  const onSelectRow = (id: number) => (_: MouseEvent<HTMLButtonElement>) => {
    setSelectedRows((prevState) => {
      if (!prevState.includes(id)) {
        return [...prevState, id]
      }
      return prevState.filter((item) => item !== id)
    })
  }

  return (
    <TableContainer>
      <Table>
        <DataGridTableHead headerGroups={table.getHeaderGroups()} />
        <DataGridFilter headerGroups={table.getHeaderGroups()} />
        <TableBody>
          {table.getRowModel().rows.map((row) => {
            const selected = isSelected(Number(row.original.id))
            return (
              <TableRow key={`row-${row.original.id}`} selected={selected} hover>
                <TableCell padding="checkbox">
                  <Checkbox checked={selected} color="primary" onClick={onSelectRow(Number(row.original.id))} />
                </TableCell>
                {row.getVisibleCells().map((cell) => (
                  // eslint-disable-next-line react/jsx-key
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
          })}
        </TableBody>
      </Table>
      <DataGridPagination />
    </TableContainer>
  )
}

export default DataGridTable
