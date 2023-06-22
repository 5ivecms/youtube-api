import { Box } from '@mui/material'
import { createColumnHelper } from '@tanstack/react-table'
import { useSnackbar } from 'notistack'
import { FC, useEffect, useState } from 'react'

import { DataGrid } from '../../../components/common/DataGrid'
import {
  DataGridFilterDef,
  FilterOptions,
  OrderOptions,
  PaginationOptions,
} from '../../../components/common/DataGrid/types'
import { getRelations } from '../../../components/common/DataGrid/utils'
import { AddButton, PageHeader } from '../../../components/ui'
import { browseRoutes } from '../../../core/config/routes.config'
import { ApiKeyService } from '../../../core/services/apiKey'
import { ANY } from '../../../core/types'
import { ApiKeyModel } from '../../../core/types/apiKey'
import { Order, SearchQueryParams } from '../../../core/types/search'
import { AdminLayout } from '../../../layouts'
import { actionButtons } from './styles'

const columnHelper = createColumnHelper<ApiKeyModel>()

const columns = [
  columnHelper.accessor('id', {
    cell: (info) => info.getValue(),
    header: () => 'ID',
    minSize: 200,
    size: 200,
  }),
  columnHelper.accessor('apiKey', {
    cell: (info) => info.getValue(),
    header: () => 'ApiKey',
    size: 2000,
  }),
  columnHelper.accessor('comment', {
    cell: (info) => info.getValue(),
    header: () => 'Комментарий',
    size: 2000,
  }),
]

const filters: DataGridFilterDef<ApiKeyModel>[] = [
  { name: 'id', placeholder: 'id', type: 'text' },
  { name: 'apiKey', placeholder: 'ApiKey', type: 'text' },
  { name: 'comment', placeholder: 'Комментарий', type: 'text' },
]

const ApiKeyIndexPage: FC = () => {
  const { enqueueSnackbar } = useSnackbar()
  const relations = getRelations(filters)

  const [params, setParams] = useState<SearchQueryParams<ApiKeyModel>>({ relations })

  const apiKeySearchQuery = ApiKeyService.useSearchQuery(params)
  const [deleteApiKey, apiKeyDeleteQuery] = ApiKeyService.useDeleteMutation()
  const [deleteBulkApiKeys, apiKeysDeleteBulkQuery] = ApiKeyService.useDeleteBulkMutation()

  const items = apiKeySearchQuery.data?.items ?? []
  const tableIsLoading = apiKeySearchQuery.isFetching || apiKeyDeleteQuery.isLoading || apiKeysDeleteBulkQuery.isLoading

  const handleDelete = async (id: number) => {
    deleteApiKey(Number(id))
  }

  const handleDeleteMany = (ids: number[]) => {
    deleteBulkApiKeys(ids.map(Number))
  }

  const onChangePage = (newPage: number): void => {
    setParams((prevParams) => ({ ...prevParams, page: newPage }))
  }

  const onChangeOrder = (order: Order) => {
    setParams((prevParams) => ({ ...prevParams, order }))
  }

  const onChangeOrderBy = (orderBy: keyof ApiKeyModel) => {
    setParams((prevParams) => ({ ...prevParams, orderBy }))
  }

  const onChangeFilter = (filter: Record<keyof ApiKeyModel, string>) => {
    setParams((prevParams) => {
      const { order, orderBy, page: prevPage, relations: prevRelations } = prevParams
      return {
        order,
        orderBy,
        page: prevPage,
        relations: prevRelations,
        ...filter,
      }
    })
  }

  useEffect(() => {
    if (apiKeyDeleteQuery.isSuccess) {
      enqueueSnackbar('Api key успешно удален', {
        variant: 'success',
      })
      return
    }
    if (apiKeyDeleteQuery.isError) {
      enqueueSnackbar((apiKeyDeleteQuery.error as ANY).data.message, {
        variant: 'error',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKeyDeleteQuery.isLoading])

  useEffect(() => {
    if (apiKeysDeleteBulkQuery.isSuccess) {
      enqueueSnackbar('Api keys успешно удалены', {
        variant: 'success',
      })
      return
    }
    if (apiKeysDeleteBulkQuery.isError) {
      enqueueSnackbar((apiKeysDeleteBulkQuery.error as ANY).data.message, {
        variant: 'error',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKeysDeleteBulkQuery.isLoading])

  const orderOptions: OrderOptions<ApiKeyModel> = {
    order: params?.order ?? 'asc',
    orderBy: params?.orderBy ?? 'id',
    onChangeOrder,
    onChangeOrderBy,
  }

  const paginationOptions: PaginationOptions = {
    limit: apiKeySearchQuery.data?.take ?? 1,
    page: apiKeySearchQuery.data?.page ?? 1,
    total: apiKeySearchQuery.data?.total ?? 0,
    onChangePage,
  }

  const filterOptions: FilterOptions = {
    filter: {},
    onChangeFilter,
  }

  return (
    <AdminLayout title="Список API KEY">
      <PageHeader
        right={
          <Box sx={actionButtons}>
            <AddButton text="Добавить" to={browseRoutes.apiKey.create()} />
          </Box>
        }
        title="API KEYS"
      />

      <DataGrid
        columns={columns}
        items={items}
        loading={tableIsLoading}
        onDelete={handleDelete}
        onDeleteMany={handleDeleteMany}
        paginationOptions={paginationOptions}
        filters={filters}
        orderOptions={orderOptions}
        filterOptions={filterOptions}
      />
    </AdminLayout>
  )
}

export default ApiKeyIndexPage
