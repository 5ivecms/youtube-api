import { Delete } from '@mui/icons-material'
import { Box, Button, Chip } from '@mui/material'
import { createColumnHelper } from '@tanstack/react-table'
import { useSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
import { CSVLink } from 'react-csv'

import { DeleteDialog } from '../../../components/common'
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

  const allKeys = YoutubeApikeyService.useFindAllQuery()

  const [showClearDialog, setShowClearDialog] = useState<boolean>(false)
  const [showResetAllErrorsDialog, setShowResetAllErrorsDialog] = useState<boolean>(false)
  const [showResetQuotaErrorsDialog, setShowResetQuotaErrorsDialog] = useState<boolean>(false)

  const [params, setParams] = useState<SearchQueryParams<YoutubeApikeyModel>>({ relations })

  const apiKeySearchQuery = YoutubeApikeyService.useSearchQuery(params)
  const [deleteApiKey, youtubeApikeyDeleteQuery] = YoutubeApikeyService.useDeleteMutation()
  const [deleteBulkApiKeys, youtubeApikeysDeleteBulkQuery] = YoutubeApikeyService.useDeleteBulkMutation()
  const [clearApiKeys, apiKeysClearQuery] = YoutubeApikeyService.useClearMutation()
  const [resetAllErrors, resetAllErrorsQuery] = YoutubeApikeyService.useResetAllErrorsMutation()
  const [resetQuotaErrors, resetQuotaErrorsQuery] = YoutubeApikeyService.useResetQuotaErrorsMutation()

  const items = apiKeySearchQuery.data?.items ?? []
  const tableIsLoading =
    apiKeySearchQuery.isFetching || youtubeApikeyDeleteQuery.isLoading || youtubeApikeysDeleteBulkQuery.isLoading

  const handleDelete = async (id: number) => {
    deleteApiKey(Number(id))
  }

  const handleDeleteMany = (ids: number[]) => {
    deleteBulkApiKeys(ids.map(Number))
  }

  const confirmClear = (): void => {
    clearApiKeys()
    setShowClearDialog(false)
  }

  const confirmResetAllErrors = (): void => {
    resetAllErrors()
    setShowResetAllErrorsDialog(false)
  }

  const confirmResetQuotaErrors = (): void => {
    resetQuotaErrors()
    setShowResetQuotaErrorsDialog(false)
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
      enqueueSnackbar((youtubeApikeysDeleteBulkQuery.error as ANY).data.message, { variant: 'error' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [youtubeApikeysDeleteBulkQuery.isLoading])

  useEffect(() => {
    if (resetAllErrorsQuery.isSuccess) {
      enqueueSnackbar('Ошибки сброшены', { variant: 'success' })
      return
    }
    if (resetAllErrorsQuery.isError) {
      enqueueSnackbar((resetAllErrorsQuery.error as ANY).data.message, { variant: 'error' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetAllErrorsQuery.isLoading])

  useEffect(() => {
    if (resetQuotaErrorsQuery.isSuccess) {
      enqueueSnackbar('Ошибки квоты сброшены', { variant: 'success' })
      return
    }
    if (resetQuotaErrorsQuery.isError) {
      enqueueSnackbar((resetQuotaErrorsQuery.error as ANY).data.message, { variant: 'error' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetQuotaErrorsQuery.isLoading])

  useEffect(() => {
    if (apiKeysClearQuery.isSuccess) {
      enqueueSnackbar('Api keys удалены', { variant: 'success' })
      return
    }
    if (apiKeysClearQuery.isError) {
      enqueueSnackbar((apiKeysClearQuery.error as ANY).data.message, { variant: 'error' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKeysClearQuery.isLoading])

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
            <CSVLink data={allKeys?.data ?? []}>Скачать все ключи</CSVLink>
            <Button color="error" variant="contained" onClick={() => setShowResetAllErrorsDialog(true)}>
              Сбросить все ошибки
            </Button>
            <Button color="error" variant="contained" onClick={() => setShowResetQuotaErrorsDialog(true)}>
              Сбросить ошибки квоты
            </Button>
            <Button color="error" endIcon={<Delete />} variant="contained" onClick={() => setShowClearDialog(true)}>
              Удалить все
            </Button>
            <AddButton text="Добавить" to={browseRoutes.youtubeApiKey.create()} />
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
      <DeleteDialog
        onClose={() => setShowClearDialog(false)}
        open={showClearDialog}
        onConfirm={confirmClear}
        text="Точно удалить все API KEYS?"
        title="Удалить все API KEYS"
      />
      <DeleteDialog
        onClose={() => setShowResetAllErrorsDialog(false)}
        open={showResetAllErrorsDialog}
        onConfirm={confirmResetAllErrors}
        text="Точно сбросить все ошибки?"
        title="Сбросить все ошибки"
        confirmButtonText="Сбросить"
      />
      <DeleteDialog
        onClose={() => setShowResetQuotaErrorsDialog(false)}
        open={showResetQuotaErrorsDialog}
        onConfirm={confirmResetQuotaErrors}
        text="Точно сбросить ошибки квоты?"
        title="Сбросить ошибки квоты"
        confirmButtonText="Сбросить"
      />
    </AdminLayout>
  )
}

export default YoutubeApiKeyIndexPage
