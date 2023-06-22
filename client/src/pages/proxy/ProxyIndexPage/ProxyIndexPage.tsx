import { Box, Button, Chip } from '@mui/material'
import { createColumnHelper } from '@tanstack/react-table'
import { useSnackbar } from 'notistack'
import { FC, useEffect, useState } from 'react'

import { DeleteDialog } from '../../../components/common'
import { DataGrid } from '../../../components/common/DataGrid'
import type {
  DataGridFilterDef,
  FilterOptions,
  OrderOptions,
  PaginationOptions,
} from '../../../components/common/DataGrid/types'
import { getRelations } from '../../../components/common/DataGrid/utils'
import { AddButton, PageHeader } from '../../../components/ui'
import { browseRoutes } from '../../../core/config/routes.config'
import { ProxyService } from '../../../core/services/proxy'
import { ANY } from '../../../core/types'
import type { ProxyModel } from '../../../core/types/proxy'
import { Order, SearchQueryParams } from '../../../core/types/search'
import { AdminLayout } from '../../../layouts'
import { actionButtons } from './styles'

const columnHelper = createColumnHelper<ProxyModel>()

const columns = [
  columnHelper.accessor('id', {
    cell: (info) => info.getValue(),
    header: () => 'ID',
    minSize: 200,
    size: 200,
  }),
  columnHelper.accessor('ip', {
    cell: (info) => info.getValue(),
    header: () => 'ip',
    size: 2000,
  }),
  columnHelper.accessor('comment', {
    cell: (info) => info.getValue(),
    header: () => 'Коммент.',
    size: 200,
  }),
  columnHelper.accessor('port', {
    cell: (info) => info.getValue(),
    header: () => 'Порт',
    size: 200,
  }),
  columnHelper.accessor('login', {
    cell: (info) => info.getValue(),
    header: () => 'Логин',
    size: 200,
  }),
  columnHelper.accessor('password', {
    cell: (info) => info.getValue(),
    header: () => 'Пароль',
    size: 200,
  }),
  columnHelper.accessor('protocol', {
    cell: (info) => info.getValue(),
    header: () => 'Протокол',
    size: 200,
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
    size: 80,
  }),
]

const filters: DataGridFilterDef<ProxyModel>[] = [
  { name: 'id', placeholder: 'id', type: 'text' },
  { name: 'ip', placeholder: 'ip', type: 'text' },
  { name: 'comment', placeholder: 'Коммент.', type: 'text' },
  { name: 'port', placeholder: 'Порт', type: 'text' },
  { name: 'login', placeholder: 'Логин', type: 'text' },
  { name: 'password', placeholder: 'Пароль', type: 'text' },
  { name: 'protocol', placeholder: 'Протокол', type: 'text' },
  { name: 'isActive', placeholder: 'Активен', type: 'text' },
]

const ProxyIndexPage: FC = () => {
  const { enqueueSnackbar } = useSnackbar()
  const relations = getRelations(filters)

  const [params, setParams] = useState<SearchQueryParams<ProxyModel>>({ relations })
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false)

  const proxySearchQuery = ProxyService.useSearchQuery(params)
  const [deleteProxy, proxyDeleteQuery] = ProxyService.useDeleteMutation()
  const [clearProxies, proxiesClearQuery] = ProxyService.useClearMutation()
  const [deleteBulkProxies, proxiesDeleteBulkQuery] = ProxyService.useDeleteBulkMutation()

  const items = proxySearchQuery.data?.items ?? []
  const tableIsLoading = proxySearchQuery.isFetching

  const handleDelete = (id: number): void => {
    deleteProxy(Number(id))
  }

  const handleDeleteMany = (ids: number[]): void => {
    deleteBulkProxies(ids.map(Number))
  }

  const handleDeleteAll = (): void => {
    setShowDeleteDialog(true)
  }

  const handleConfirmDeleteAll = (): void => {
    setShowDeleteDialog(false)
    clearProxies()
  }

  const onCloseDeleteDialog = () => {
    setShowDeleteDialog(false)
  }

  const onChangePage = (newPage: number): void => {
    setParams((prevParams) => ({ ...prevParams, page: newPage }))
  }

  const onChangeOrder = (order: Order) => {
    setParams((prevParams) => ({ ...prevParams, order }))
  }

  const onChangeOrderBy = (orderBy: keyof ProxyModel) => {
    setParams((prevParams) => ({ ...prevParams, orderBy }))
  }

  const onChangeFilter = (filter: Record<keyof ProxyModel, string>) => {
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
    if (proxiesClearQuery.isSuccess) {
      enqueueSnackbar('Все прокси успешно удалены', {
        variant: 'success',
      })
      return
    }
    if (proxiesClearQuery.isError) {
      enqueueSnackbar((proxiesClearQuery.error as ANY).data.message, {
        variant: 'error',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proxiesClearQuery.isLoading])

  useEffect(() => {
    if (proxyDeleteQuery.isSuccess) {
      enqueueSnackbar('Прокси успешно удален', {
        variant: 'success',
      })
      return
    }
    if (proxyDeleteQuery.isError) {
      enqueueSnackbar((proxyDeleteQuery.error as ANY).data.message, {
        variant: 'error',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proxyDeleteQuery.isLoading])

  useEffect(() => {
    if (proxiesDeleteBulkQuery.isSuccess) {
      enqueueSnackbar('Прокси успешно удалены', {
        variant: 'success',
      })
      return
    }
    if (proxiesDeleteBulkQuery.isError) {
      enqueueSnackbar((proxiesDeleteBulkQuery.error as ANY).data.message, {
        variant: 'error',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proxiesDeleteBulkQuery.isLoading])

  const orderOptions: OrderOptions<ProxyModel> = {
    order: params?.order ?? 'asc',
    orderBy: params?.orderBy ?? 'id',
    onChangeOrder,
    onChangeOrderBy,
  }

  const paginationOptions: PaginationOptions = {
    limit: proxySearchQuery.data?.take ?? 1,
    page: proxySearchQuery.data?.page ?? 1,
    total: proxySearchQuery.data?.total ?? 0,
    onChangePage,
  }

  const filterOptions: FilterOptions = {
    filter: {},
    onChangeFilter,
  }

  return (
    <AdminLayout title="Список прокси">
      <PageHeader
        right={
          <Box sx={actionButtons}>
            <Button color="error" onClick={handleDeleteAll} variant="contained">
              Удалить все
            </Button>
            <AddButton text="Добавить" to={browseRoutes.proxy.create()} />
          </Box>
        }
        title="Прокси"
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
        onClose={onCloseDeleteDialog}
        onConfirm={handleConfirmDeleteAll}
        open={showDeleteDialog}
        text="Точно удалить все прокси?"
        title="Удалить прокси"
      />
    </AdminLayout>
  )
}

export default ProxyIndexPage
