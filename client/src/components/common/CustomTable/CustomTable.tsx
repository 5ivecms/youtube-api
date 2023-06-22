/* eslint-disable react/no-array-index-key */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { grey } from '@mui/material/colors'
import type { FC } from 'react'

import type { CustomTableColumn } from './custom-table.types'

interface CustomTableProps {
  columns: CustomTableColumn[]
  data: any[]
}

const CustomTable: FC<CustomTableProps> = ({ columns, data }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: grey[100] }}>
            {columns.map((column) => (
              <TableCell key={`custom-table-head-row-${column.field}`} sx={{ fontWeight: 'bold' }}>
                {column.header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((dataRow, index) => (
            <TableRow key={`custom-table-row-${index}`}>
              {columns.map((column) => (
                <TableCell key={`custom-table-head-row-${index}-cell-${column.field}`}>
                  {dataRow[column.field] ?? ''}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default CustomTable
