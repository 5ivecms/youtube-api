import { Box, Button } from '@mui/material'
import { createColumnHelper } from '@tanstack/react-table'
import { useSnackbar } from 'notistack'
import { useEffect, useState } from 'react'

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
import { ChannelBlacklistService } from '../../../core/services/channel-blacklist'
import { ANY } from '../../../core/types'
import { ChannelBlacklistModel } from '../../../core/types/channel-blacklist'
import { Order, SearchQueryParams } from '../../../core/types/search'
import { AdminLayout } from '../../../layouts'
import { actionButtons } from './ChannelBlacklistIndexPage.styles'

const columnHelper = createColumnHelper<ChannelBlacklistModel>()

const columns = [
  columnHelper.accessor('id', {
    cell: (info) => info.getValue(),
    header: () => 'ID',
    minSize: 200,
    size: 200,
  }),
  columnHelper.accessor('channelId', {
    cell: (info) => info.getValue(),
    header: () => 'ChannelId',
    size: 2000,
  }),
  columnHelper.accessor('reason', {
    cell: (info) => info.getValue(),
    header: () => 'Причина',
    size: 200,
  }),
  columnHelper.accessor('createdAt', {
    cell: (info) => info.getValue(),
    header: () => 'Дата',
    size: 200,
  }),
]

const filters: DataGridFilterDef<ChannelBlacklistModel>[] = [
  { name: 'id', placeholder: 'id', type: 'text' },
  { name: 'channelId', placeholder: 'ChannelId', type: 'text' },
  { name: 'reason', placeholder: 'Причина', type: 'text' },
  { name: 'createdAt', placeholder: 'Дата', type: 'text' },
]
const ChannelBlacklistIndexPage = () => {
  const { enqueueSnackbar } = useSnackbar()
  const relations = getRelations(filters)

  const [params, setParams] = useState<SearchQueryParams<ChannelBlacklistModel>>({ relations })
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false)

  const channelBlacklistSearchQuery = ChannelBlacklistService.useSearchQuery(params)
  const [deleteChannelBlacklist, channelBlacklistDeleteQuery] = ChannelBlacklistService.useDeleteMutation()
  const [deleteBulkChannelBlacklist, channelBlacklistDeleteBulkQuery] = ChannelBlacklistService.useDeleteBulkMutation()
  const [clearChannelBlacklist, channelBlacklistClearQuery] = ChannelBlacklistService.useClearMutation()

  const items = channelBlacklistSearchQuery?.data?.items ?? []

  const tableIsLoading =
    channelBlacklistSearchQuery.isFetching ||
    channelBlacklistDeleteQuery.isLoading ||
    channelBlacklistDeleteBulkQuery.isLoading ||
    channelBlacklistClearQuery.isLoading

  const handleDelete = (id: number): void => {
    deleteChannelBlacklist(Number(id))
  }

  const handleDeleteMany = (ids: number[]): void => {
    deleteBulkChannelBlacklist(ids.map(Number))
  }

  const handleDeleteAll = (): void => {
    setShowDeleteDialog(true)
  }

  const handleConfirmDeleteAll = (): void => {
    setShowDeleteDialog(false)
    clearChannelBlacklist()
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

  const onChangeOrderBy = (orderBy: keyof ChannelBlacklistModel) => {
    setParams((prevParams) => ({ ...prevParams, orderBy }))
  }

  const onChangeFilter = (filter: Record<keyof ChannelBlacklistModel, string>) => {
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
    if (channelBlacklistClearQuery.isSuccess) {
      enqueueSnackbar('Все стоп-слова успешно удалены', {
        variant: 'success',
      })
      return
    }
    if (channelBlacklistClearQuery.isError) {
      enqueueSnackbar((channelBlacklistClearQuery.error as ANY).data.message, {
        variant: 'error',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelBlacklistClearQuery.isLoading])

  useEffect(() => {
    if (channelBlacklistDeleteQuery.isSuccess) {
      enqueueSnackbar('Стоп-слово успешно удалено', { variant: 'success' })
      return
    }
    if (channelBlacklistDeleteQuery.isError) {
      enqueueSnackbar((channelBlacklistDeleteQuery.error as ANY).data.message, { variant: 'error' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelBlacklistDeleteQuery.isLoading])

  useEffect(() => {
    if (channelBlacklistDeleteBulkQuery.isSuccess) {
      enqueueSnackbar('Стоп-слова успешно удалены', { variant: 'success' })
      return
    }
    if (channelBlacklistDeleteBulkQuery.isError) {
      enqueueSnackbar((channelBlacklistDeleteBulkQuery.error as ANY).data.message, { variant: 'error' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelBlacklistDeleteBulkQuery.isLoading])

  const orderOptions: OrderOptions<ChannelBlacklistModel> = {
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
    limit: channelBlacklistSearchQuery.data?.take ?? 1,
    page: channelBlacklistSearchQuery.data?.page ?? 1,
    total: channelBlacklistSearchQuery.data?.total ?? 0,
    onChangePage,
  }

  return (
    <AdminLayout title="Черный список каналов">
      <PageHeader
        right={
          <Box sx={actionButtons}>
            <Button color="error" onClick={handleDeleteAll} variant="contained">
              Удалить все
            </Button>
            <AddButton text="Добавить" to={browseRoutes.channelBlacklist.create()} />
          </Box>
        }
        title="Черный список каналов"
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
        onClose={onCloseDeleteDialog}
        onConfirm={handleConfirmDeleteAll}
        open={showDeleteDialog}
        text="Точно удалить все каналы из черного списка?"
        title="Удалить каналы из черного списка"
      />
    </AdminLayout>
  )
}

export default ChannelBlacklistIndexPage
