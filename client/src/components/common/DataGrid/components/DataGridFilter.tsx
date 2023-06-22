import { Delete, FilterAltOff } from '@mui/icons-material'
import { Box, Checkbox, IconButton, MenuItem, TableCell, TableHead, TableRow, TextField } from '@mui/material'
import { HeaderGroup } from '@tanstack/react-table'
import type { ChangeEvent, ReactElement } from 'react'
import { useEffect, useState } from 'react'

import { useDebounce } from '../../../../core/hooks'
import { useDataGridContext } from '../hooks/useDataGrid'
import { filterCell } from '../styles.sx'
import type { BaseItem, Search } from '../types'
import { filterParams } from '../utils'
import { AsyncAutocomplete } from './AsyncAutocomplete'

interface DataGridFilter<T extends BaseItem = BaseItem> {
  headerGroups: HeaderGroup<T>[]
}

const DataGridFilter = <T extends BaseItem = BaseItem>({ headerGroups }: DataGridFilter<T>): ReactElement => {
  const { filterOptions, filters, selectedRows, items, handleSelectAll, onDeleteMany, setShowDeleteManyDialog } =
    useDataGridContext<T>()

  const search = filterOptions ? filterOptions.filter : {}

  const rowsCount = Number((items ?? []).length)
  const [params, setParams] = useState<Search>({})
  const debouncedParams = useDebounce(params, 500)

  const emptyCells: number[] = []
  if (filters) {
    for (let i = 0; i < headerGroups[0].headers.length - filters.length; i += 1) {
      emptyCells.push(i)
    }
  }

  const handleSearch = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target
    setParams((prev) => ({ ...prev, [name]: value }))
  }

  const handleResetFilter = (): void => {
    setParams({})
    if (filterOptions) {
      filterOptions.onChangeFilter({})
    }
  }

  const handleDeleteMany = (): void => {
    setShowDeleteManyDialog(true)
  }

  useEffect(() => {
    const newSearchParams = { ...filterParams({ ...search, ...debouncedParams }) }
    if (filterOptions) {
      filterOptions.onChangeFilter(newSearchParams)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedParams])

  return filters !== undefined && filters.length > 0 ? (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            checked={rowsCount > 0 && selectedRows.length === rowsCount}
            color="primary"
            indeterminate={selectedRows.length > 0 && selectedRows.length < rowsCount}
            inputProps={{ 'aria-label': 'select all desserts' }}
            onChange={handleSelectAll}
          />
        </TableCell>

        {filters.map((filter) => {
          return (
            <TableCell key={`filter-${String(filter.name)}`} sx={filterCell}>
              {filter.type === 'text' && (
                <TextField
                  label={String(filter?.placeholder || '')}
                  name={String(filter.name)}
                  onChange={handleSearch}
                  placeholder={filter?.placeholder || ''}
                  size="small"
                  type="text"
                  value={params[String(filter.name)] || ''}
                  fullWidth
                />
              )}

              {filter.type === 'select' && filter.options !== undefined && (
                <TextField
                  defaultValue=""
                  label={filter?.placeholder || ''}
                  name={String(filter.name)}
                  onChange={handleSearch}
                  placeholder={filter?.placeholder || ''}
                  size="small"
                  fullWidth
                  select
                >
                  {filter.options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              )}

              {filter.type === 'asyncSelect' && filter.asyncSelectOptions !== undefined && (
                <AsyncAutocomplete
                  loadOptions={filter.asyncSelectOptions.loadOptions}
                  onChange={(value) => setParams((prev) => ({ ...prev, [String(filter?.name)]: value }))}
                  placeholder={filter?.placeholder || ''}
                />
              )}
            </TableCell>
          )
        })}

        <TableCell sx={{ py: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <Box>
              {Object.keys(params).length > 0 && (
                <IconButton color="default" onClick={handleResetFilter}>
                  <FilterAltOff />
                </IconButton>
              )}
            </Box>
            <Box>
              {onDeleteMany !== undefined && selectedRows.length > 0 && (
                <IconButton color="error" onClick={handleDeleteMany}>
                  <Delete />
                </IconButton>
              )}
            </Box>
          </Box>
        </TableCell>
        {emptyCells.map((key) => (
          <TableCell key={`filter-empty-cell${key}`} />
        ))}
      </TableRow>
    </TableHead>
  ) : (
    <></>
  )
}

export default DataGridFilter
