/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import styled from '@emotion/styled'
import { Paper, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material'
import { grey } from '@mui/material/colors'
import type { FC } from 'react'

interface InfoTableProps {
  columns: any[]
  data: any
  thWidth: number
}

const TableTh = styled(TableCell)(() => ({
  borderRight: `1px solid ${grey[300]}`,
  fontWeight: 'bold',
}))

const InfoTable: FC<InfoTableProps> = ({ data, columns, thWidth }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableBody>
          {columns &&
            columns.map((column) => (
              <TableRow key={`info-table-row-${column.field}`}>
                <TableTh width={thWidth}>{column.headerName}</TableTh>
                <TableCell>{column.render ? column.render(data[column.field]) : data[column.field]}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default InfoTable
