import { Box, Pagination, Typography } from '@mui/material'
import type { ReactElement } from 'react'
import { useCallback } from 'react'

import { useDataGridContext } from '../../hooks/useDataGrid'
import type { BaseItem } from '../../types'
import { container, statistic } from './styles.sx'

const DataGridPagination = <T extends BaseItem>(): ReactElement => {
  const { paginationOptions } = useDataGridContext<T>()

  if (!paginationOptions) {
    return <></>
  }
  const { total, limit, page, onChangePage } = paginationOptions

  const count = Math.ceil(total / limit)

  const onPageChange = useCallback(
    (_: unknown, newPage: number) => {
      onChangePage(Number(newPage))
    },
    [onChangePage]
  )

  return (
    <Box sx={container}>
      <Pagination
        color="primary"
        count={count}
        onChange={onPageChange}
        page={Number(page)}
        size="medium"
        showFirstButton
        showLastButton
      />
      <Box sx={statistic}>
        <Typography fontSize={14}>Всего: {total.toLocaleString()}</Typography>
      </Box>
    </Box>
  )
}

export default DataGridPagination
