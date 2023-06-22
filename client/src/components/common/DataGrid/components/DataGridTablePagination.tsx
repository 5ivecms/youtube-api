import type { SxProps } from '@mui/material'
import { Box, Pagination, Typography } from '@mui/material'
import type { ChangeEvent, ReactElement } from 'react'

import { useDataGridContext } from '../hooks/useDataGrid'
import type { BaseItem } from '../types'

export const paginationContainer: SxProps = {
  alignContent: 'center',
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'space-between',
  py: 2,
  width: '100%',
}

export const paginationStat: SxProps = {
  mr: 2,
}

const DataGridTablePagination = <T extends BaseItem>(): ReactElement => {
  const { paginationOptions } = useDataGridContext<T>()

  if (!paginationOptions) {
    return <></>
  }

  const { limit, page, total, onChangePage } = paginationOptions

  const handleChange = (_: ChangeEvent<unknown>, newPage: number): void => {
    onChangePage(newPage)
  }

  return (
    <Box sx={paginationContainer}>
      <Pagination
        color="primary"
        count={Math.ceil(total / limit)}
        onChange={handleChange}
        page={Number(page)}
        size="medium"
        showFirstButton
        showLastButton
      />
      <Box sx={paginationStat}>
        <Typography fontSize={14} fontWeight="bold">
          Всего: {total.toLocaleString()}
        </Typography>
      </Box>
    </Box>
  )
}

export default DataGridTablePagination
