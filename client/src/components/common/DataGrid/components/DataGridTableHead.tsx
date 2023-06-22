/* eslint-disable react/jsx-key */
import { Box, TableCell, TableHead, TableRow, TableSortLabel } from '@mui/material'
import { grey } from '@mui/material/colors'
import { visuallyHidden } from '@mui/utils'
import { flexRender, HeaderGroup } from '@tanstack/react-table'
import type { ReactElement } from 'react'

import { useDataGridContext } from '../hooks/useDataGrid'
import type { ANY, BaseItem } from '../types'

interface DataGridTableHeadProps<T extends BaseItem = BaseItem> {
  headerGroups: HeaderGroup<T>[]
}

const DataGridTableHead = <T extends BaseItem>({ headerGroups }: DataGridTableHeadProps<T>): ReactElement => {
  const { orderOptions } = useDataGridContext<T>()

  const order = orderOptions ? orderOptions.order : 'asc'
  const orderBy = orderOptions ? orderOptions.orderBy : ''

  const onSort = (property: keyof T) => () => {
    const isAsc = orderBy === property && order === 'asc'
    const newOrder = isAsc ? 'desc' : 'asc'
    if (orderOptions) {
      orderOptions.onChangeOrder(newOrder)
      orderOptions.onChangeOrderBy(property)
    }
  }

  return (
    <TableHead>
      {headerGroups.map((headerGroup) => {
        return (
          <TableRow key={headerGroup.id} sx={{ backgroundColor: grey[100] }}>
            <TableCell />
            {headerGroup.headers.map((header) => {
              const orderKey = (header.column.columnDef as ANY).accessorKey as keyof T
              return (
                <TableCell
                  {...{
                    colSpan: header.colSpan,
                    key: header.id,
                    style: { width: header.getSize() },
                  }}
                >
                  <TableSortLabel
                    active={orderBy === orderKey}
                    direction={orderBy === orderKey ? order : 'asc'}
                    onClick={onSort(orderKey)}
                    sx={{ fontWeight: 'bold' }}
                  >
                    {header.isPlaceholder ? undefined : flexRender(header.column.columnDef.header, header.getContext())}
                    {orderBy === orderKey ? (
                      <Box component="span" sx={visuallyHidden}>
                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                      </Box>
                    ) : (
                      <></>
                    )}
                  </TableSortLabel>
                </TableCell>
              )
            })}
            <TableCell />
          </TableRow>
        )
      })}
    </TableHead>
  )
}

export default DataGridTableHead
