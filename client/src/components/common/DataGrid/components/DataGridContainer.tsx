import { Paper } from '@mui/material'
import type { ReactElement } from 'react'

import { useDataGridContext } from '../hooks/useDataGrid'
import type { BaseItem } from '../types'
import DataGridDialogs from './DataGridDialogs/DataGridDialogs'
import DataGridLoader from './DataGridLoader/DataGridLoader'
import DataGridTable from './DataGridTable'

const DataGridContainer = <T extends BaseItem>(): ReactElement => {
  const { loading } = useDataGridContext<T>()

  return (
    <Paper sx={{ position: 'relative' }}>
      <DataGridTable />
      {loading && <DataGridLoader />}
      <DataGridDialogs />
    </Paper>
  )
}

export default DataGridContainer
