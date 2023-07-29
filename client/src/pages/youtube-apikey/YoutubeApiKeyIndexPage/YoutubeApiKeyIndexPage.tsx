import { Box, Chip } from '@mui/material'
import { createColumnHelper } from '@tanstack/react-table'
import { useSnackbar } from 'notistack'
import { useEffect, useState } from 'react'

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
import { YoutubeApikeyService } from '../../../core/services/youtubeApikey'
import { ANY } from '../../../core/types'
import { Order, SearchQueryParams } from '../../../core/types/search'
import { YoutubeApikeyModel } from '../../../core/types/youtubeApikey'
import { AdminLayout } from '../../../layouts'
import { actionButtons } from './YoutubeApiKeyIndexPage.styles'

const columnHelper = createColumnHelper<YoutubeApikeyModel>()

const columns = [
  columnHelper.accessor('id', {
    cell: (info) => info.getValue(),
    header: () => 'ID',
    minSize: 200,
    size: 200,
  }),
  columnHelper.accessor('apikey', {
    cell: (info) => info.getValue(),
    header: () => 'ApiKey',
    size: 2000,
  }),
  columnHelper.accessor('currentUsage', {
    cell: (info) => info.getValue(),
    header: () => 'Израсходовано',
    size: 2000,
  }),
  columnHelper.accessor('dailyLimit', {
    cell: (info) => info.getValue(),
    header: () => 'Квота',
    size: 2000,
  }),
  columnHelper.accessor('comment', {
    cell: (info) => info.getValue(),
    header: () => 'Комментарий',
    size: 2000,
  }),
  columnHelper.accessor('error', {
    cell: (info) => info.getValue(),
    header: () => 'Ошибка',
    size: 2000,
  }),
  columnHelper.accessor('isActive', {
    cell: ({ row }) => (
      <Chip
        color={row.original.isActive ? 'success' : 'error'}
        label={row.original.isActive ? 'Да' : 'Нет'}
        size="small"
      />
    ),
    header: () => 'Активен',
    size: 2000,
  }),
]

const filters: DataGridFilterDef<YoutubeApikeyModel>[] = [
  { name: 'id', placeholder: 'id', type: 'text' },
  { name: 'apikey', placeholder: 'ApiKey', type: 'text' },
  { name: 'currentUsage', placeholder: 'Текущее использование', type: 'text' },
  { name: 'dailyLimit', placeholder: 'Дневной лимит', type: 'text' },
  { name: 'comment', placeholder: 'Комментарий', type: 'text' },
  { name: 'error', placeholder: 'Ошибка', type: 'text' },
  { name: 'isActive', placeholder: 'Активен', type: 'text' },
]

const YoutubeApiKeyIndexPage = () => {
  const { enqueueSnackbar } = useSnackbar()
  const relations = getRelations(filters)

  const [params, setParams] = useState<SearchQueryParams<YoutubeApikeyModel>>({ relations })

  const apiKeySearchQuery = YoutubeApikeyService.useSearchQuery(params)
  const [deleteApiKey, youtubeApikeyDeleteQuery] = YoutubeApikeyService.useDeleteMutation()
  const [deleteBulkApiKeys, youtubeApikeysDeleteBulkQuery] = YoutubeApikeyService.useDeleteBulkMutation()

  const items = apiKeySearchQuery.data?.items ?? []
  const tableIsLoading =
    apiKeySearchQuery.isFetching || youtubeApikeyDeleteQuery.isLoading || youtubeApikeysDeleteBulkQuery.isLoading

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

  const onChangeOrderBy = (orderBy: keyof YoutubeApikeyModel) => {
    setParams((prevParams) => ({ ...prevParams, orderBy }))
  }

  const onChangeFilter = (filter: Record<keyof YoutubeApikeyModel, string>) => {
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
    if (youtubeApikeyDeleteQuery.isSuccess) {
      enqueueSnackbar('Api key успешно удален', {
        variant: 'success',
      })
      return
    }
    if (youtubeApikeyDeleteQuery.isError) {
      enqueueSnackbar((youtubeApikeyDeleteQuery.error as ANY).data.message, {
        variant: 'error',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [youtubeApikeyDeleteQuery.isLoading])

  useEffect(() => {
    if (youtubeApikeysDeleteBulkQuery.isSuccess) {
      enqueueSnackbar('Api keys успешно удалены', {
        variant: 'success',
      })
      return
    }
    if (youtubeApikeysDeleteBulkQuery.isError) {
      enqueueSnackbar((youtubeApikeysDeleteBulkQuery.error as ANY).data.message, {
        variant: 'error',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [youtubeApikeysDeleteBulkQuery.isLoading])

  const orderOptions: OrderOptions<YoutubeApikeyModel> = {
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
    <AdminLayout title="Список Youtube API KEYS">
      <PageHeader
        right={
          <Box sx={actionButtons}>
            <AddButton text="Добавить" to={browseRoutes.youtubeApiey.create()} />
          </Box>
        }
        title="Youtube API KEYS"
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

export default YoutubeApiKeyIndexPage
