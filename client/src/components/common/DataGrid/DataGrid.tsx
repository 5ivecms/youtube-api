import type { ReactElement } from 'react'

import DataGridContainer from './components/DataGridContainer'
import DataGridProvider from './DataGridProvider'
import type { BaseItem, DataGridProps } from './types'

export const DataGrid = <T extends BaseItem>(props: DataGridProps<T>): ReactElement => {
  return (
    <DataGridProvider {...props}>
      <DataGridContainer />
    </DataGridProvider>
  )
}
