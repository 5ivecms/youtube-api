import { Bolt } from '@mui/icons-material'
import { Box, Button, Chip, IconButton, Tooltip, Typography } from '@mui/material'
import type { ColumnDef } from '@tanstack/react-table'
import { createColumnHelper } from '@tanstack/react-table'
import { useSnackbar } from 'notistack'
import { FC, useEffect, useState } from 'react'

import { DeleteDialog } from '../../../components/common'
import { DataGrid } from '../../../components/common/DataGrid'
import type {
  ANY,
  DataGridFilterDef,
  FilterOptions,
  OrderOptions,
  PaginationOptions,
} from '../../../components/common/DataGrid/types'
import { getRelations } from '../../../components/common/DataGrid/utils'
import { AddButton, PageHeader } from '../../../components/ui'
import { browseRoutes } from '../../../core/config/routes.config'
import { InvidiousService } from '../../../core/services/invidious'
import type { InvidiousModel } from '../../../core/types/invidious'
import { Order, SearchQueryParams } from '../../../core/types/search'
import { AdminLayout } from '../../../layouts'
import { actionButtons, hostComment } from './InvidiousIndexPage.styles'

const columnHelper = createColumnHelper<InvidiousModel>()

const filters: DataGridFilterDef<InvidiousModel>[] = [
  { name: 'id', placeholder: 'id', type: 'text' },
  { name: 'host', placeholder: 'Хост', type: 'text' },
  { name: 'pingMin', placeholder: 'Пинг, мин', type: 'text' },
  { name: 'pingMax', placeholder: 'Пинг, макс', type: 'text' },
  { name: 'pingAvg', placeholder: 'Пинг, ср', type: 'text' },
  { name: 'isActive', placeholder: 'Статус', type: 'text' },
  { name: 'isWorkable', placeholder: 'Работает', type: 'text' },
]

const InvidiousIndexPage: FC = () => {
  const { enqueueSnackbar } = useSnackbar()

  const relations = getRelations(filters)
  const [params, setParams] = useState<SearchQueryParams<InvidiousModel>>({ relations })

  const invidiousSearchQuery = InvidiousService.useSearchQuery(params)
  const [deleteInvidious, invidiousDeleteQuery] = InvidiousService.useDeleteMutation()
  const [deleteBulkInvidious, invidiousDeleteBulkQuery] = InvidiousService.useDeleteBulkMutation()
  const [healthCheckInvidious, invidiousHealthCheckQuery] = InvidiousService.useHealthCheckMutation()
  const [healthCheckAllInvidious, invidiousHealthCheckAllQuery] = InvidiousService.useHealthCheckAllMutation()
  const [resetStateInvidious, resetStateQuery] = InvidiousService.useResetStateMutation()
  const [loadHostsInvidious, loadHostsQuery] = InvidiousService.useLoadHostsMutation()

  const items = invidiousSearchQuery?.data?.items ?? []

  const tableIsLoading =
    invidiousSearchQuery.isFetching ||
    invidiousHealthCheckQuery.isLoading ||
    invidiousHealthCheckAllQuery.isLoading ||
    resetStateQuery.isLoading ||
    invidiousDeleteQuery.isLoading ||
    invidiousDeleteBulkQuery.isLoading ||
    loadHostsQuery.isLoading

  const [showResetDialog, setShowResetDialog] = useState<boolean>(false)

  const healthCheck = (id: number): void => {
    healthCheckInvidious(id)
  }

  const columns: ColumnDef<InvidiousModel, ANY>[] = [
    columnHelper.accessor('id', {
      cell: (info) => info.getValue(),
      header: () => 'ID',
      minSize: 200,
      size: 200,
    }),
    columnHelper.accessor('host', {
      cell: ({ row }) => {
        return (
          <>
            {row.original.host}
            <Typography sx={hostComment}>{row.original.comment}</Typography>
          </>
        )
      },
      header: () => 'Хост',
      size: 2000,
    }),
    columnHelper.accessor('pingMin', {
      cell: (info) => info.getValue(),
      header: () => 'Пинг,мин',
      size: 280,
    }),
    columnHelper.accessor('pingMax', {
      cell: (info) => info.getValue(),
      header: () => 'Пинг,макс',
      size: 280,
    }),
    columnHelper.accessor('pingAvg', {
      cell: (info) => info.getValue(),
      header: () => 'Пинг,ср',
      size: 280,
    }),
    columnHelper.accessor('isActive', {
      cell: ({ row }) => (
        <Chip
          color={row.original.isActive ? 'success' : 'error'}
          label={row.original.isActive ? 'Да' : 'Нет'}
          size="small"
        />
      ),
      header: () => 'Статус',
      size: 80,
    }),
    columnHelper.accessor('isWorkable', {
      cell: ({ row }) => (
        <Chip
          color={row.original.isWorkable ? 'success' : 'error'}
          label={row.original.isWorkable ? 'Да' : 'Нет'}
          size="small"
        />
      ),
      header: () => 'Работает',
      size: 80,
    }),
    columnHelper.display({
      cell: ({ row }) => {
        return (
          <Tooltip title="Health check">
            <IconButton color="warning" component="label" onClick={() => healthCheck(row.original.id)}>
              <Bolt />
            </IconButton>
          </Tooltip>
        )
      },
      id: 'healthCheck',
    }),
  ]

  const handleHealthCheckAll = (): void => {
    healthCheckAllInvidious()
  }

  const confirmReset = (): void => {
    resetStateInvidious()
    setShowResetDialog(false)
  }

  const resetHostsState = (): void => {
    setShowResetDialog(true)
  }

  const loadHosts = (): void => {
    loadHostsInvidious()
  }

  const handleDelete = async (id: number): Promise<void> => {
    deleteInvidious(id)
  }

  const handleDeleteMany = (ids: number[]): void => {
    deleteBulkInvidious(ids.map(Number))
  }

  const onChangePage = (newPage: number): void => {
    setParams((prevParams) => ({ ...prevParams, page: newPage }))
  }

  const onChangeOrder = (order: Order) => {
    setParams((prevParams) => ({ ...prevParams, order }))
  }

  const onChangeOrderBy = (orderBy: keyof InvidiousModel) => {
    setParams((prevParams) => ({ ...prevParams, orderBy }))
  }

  const onChangeFilter = (filter: Record<keyof InvidiousModel, string>) => {
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
    if (invidiousDeleteQuery.isSuccess) {
      enqueueSnackbar('Юзерагент успешно удален', {
        variant: 'success',
      })
      return
    }
    if (invidiousDeleteQuery.isError) {
      enqueueSnackbar((invidiousDeleteQuery.error as ANY).data.message, {
        variant: 'error',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invidiousDeleteQuery.isLoading])

  useEffect(() => {
    if (invidiousDeleteBulkQuery.isSuccess) {
      enqueueSnackbar('Юзерагенты успешно удалены', {
        variant: 'success',
      })
      return
    }
    if (invidiousDeleteBulkQuery.isError) {
      enqueueSnackbar((invidiousDeleteBulkQuery.error as ANY).data.message, {
        variant: 'error',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invidiousDeleteBulkQuery.isLoading])

  useEffect(() => {
    if (invidiousHealthCheckQuery.isSuccess) {
      enqueueSnackbar('Health check выполнен успешно', {
        variant: 'success',
      })
      return
    }
    if (invidiousHealthCheckQuery.isError) {
      enqueueSnackbar((invidiousHealthCheckQuery.error as ANY).data.message, {
        variant: 'error',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invidiousHealthCheckQuery.isLoading])

  useEffect(() => {
    if (invidiousHealthCheckAllQuery.isSuccess) {
      enqueueSnackbar('Health check выполнен успешно', {
        variant: 'success',
      })
      return
    }
    if (invidiousHealthCheckAllQuery.isError) {
      enqueueSnackbar((invidiousHealthCheckAllQuery.error as ANY).data.message, {
        variant: 'error',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invidiousHealthCheckAllQuery.isLoading])

  useEffect(() => {
    if (resetStateQuery.isSuccess) {
      enqueueSnackbar('Состояние хостов успешно сброшено', {
        variant: 'success',
      })
      return
    }
    if (resetStateQuery.isError) {
      enqueueSnackbar((resetStateQuery.error as ANY).data.message, {
        variant: 'error',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetStateQuery.isLoading])

  const orderOptions: OrderOptions<InvidiousModel> = {
    order: params?.order ?? 'asc',
    orderBy: params?.orderBy ?? 'id',
    onChangeOrder,
    onChangeOrderBy,
  }

  const filterOptions: FilterOptions = {
    filter: {},
    onChangeFilter,
  }

  const paginationOptions: PaginationOptions = {
    limit: invidiousSearchQuery.data?.take ?? 1,
    page: invidiousSearchQuery.data?.page ?? 1,
    total: invidiousSearchQuery.data?.total ?? 0,
    onChangePage,
  }

  return (
    <AdminLayout title="Invidious хосты">
      <PageHeader
        right={
          <Box sx={actionButtons}>
            <Button color="warning" onClick={loadHosts} variant="contained">
              Загрузить хосты
            </Button>
            <Button color="warning" onClick={handleHealthCheckAll} variant="contained">
              Health check всех
            </Button>
            <Button color="warning" onClick={resetHostsState} variant="contained">
              Сбросить состояние
            </Button>
            <AddButton text="Добавить" to={browseRoutes.invidious.create()} />
          </Box>
        }
        title="Invidious"
      />

      <DataGrid
        columns={columns}
        items={items}
        loading={tableIsLoading}
        onDelete={handleDelete}
        onDeleteMany={handleDeleteMany}
        paginationOptions={paginationOptions}
        filters={filters}
        filterOptions={filterOptions}
        orderOptions={orderOptions}
      />

      <DeleteDialog
        onClose={() => setShowResetDialog(false)}
        open={showResetDialog}
        onConfirm={confirmReset}
        text="Точно сбросить состояние хостов?"
        title="Сброс состояния хостов"
      />
    </AdminLayout>
  )
}

export default InvidiousIndexPage
