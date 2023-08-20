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
import { VideoBlacklistService } from '../../../core/services/video-blacklist'
import { ANY } from '../../../core/types'
import { Order, SearchQueryParams } from '../../../core/types/search'
import { VideoBlacklistModel } from '../../../core/types/video-blacklist'
import { AdminLayout } from '../../../layouts'
import { actionButtons } from './VideoBlacklistIndexPage.styles'

const columnHelper = createColumnHelper<VideoBlacklistModel>()

const columns = [
  columnHelper.accessor('id', {
    cell: (info) => info.getValue(),
    header: () => 'ID',
    minSize: 200,
    size: 200,
  }),
  columnHelper.accessor('videoId', {
    cell: (info) => info.getValue(),
    header: () => 'VideoId',
    size: 2000,
  }),
]

const filters: DataGridFilterDef<VideoBlacklistModel>[] = [
  { name: 'id', placeholder: 'id', type: 'text' },
  { name: 'videoId', placeholder: 'VideoId', type: 'text' },
]

const VideoBlacklistIndexPage = () => {
  const { enqueueSnackbar } = useSnackbar()
  const relations = getRelations(filters)

  const [params, setParams] = useState<SearchQueryParams<VideoBlacklistModel>>({ relations })
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false)

  const videoBlacklistSearchQuery = VideoBlacklistService.useSearchQuery(params)
  const [deleteVideoBlacklist, VideoBlacklistDeleteQuery] = VideoBlacklistService.useDeleteMutation()
  const [deleteBulkVideoBlacklist, VideoBlacklistDeleteBulkQuery] = VideoBlacklistService.useDeleteBulkMutation()
  const [clearVideoBlacklist, VideoBlacklistClearQuery] = VideoBlacklistService.useClearMutation()

  const items = videoBlacklistSearchQuery?.data?.items ?? []

  const tableIsLoading =
    videoBlacklistSearchQuery.isFetching ||
    VideoBlacklistDeleteQuery.isLoading ||
    VideoBlacklistDeleteBulkQuery.isLoading ||
    VideoBlacklistClearQuery.isLoading

  const handleDelete = (id: number): void => {
    deleteVideoBlacklist(Number(id))
  }

  const handleDeleteMany = (ids: number[]): void => {
    deleteBulkVideoBlacklist(ids.map(Number))
  }

  const handleDeleteAll = (): void => {
    setShowDeleteDialog(true)
  }

  const handleConfirmDeleteAll = (): void => {
    setShowDeleteDialog(false)
    clearVideoBlacklist()
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

  const onChangeOrderBy = (orderBy: keyof VideoBlacklistModel) => {
    setParams((prevParams) => ({ ...prevParams, orderBy }))
  }

  const onChangeFilter = (filter: Record<keyof VideoBlacklistModel, string>) => {
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
    if (VideoBlacklistClearQuery.isSuccess) {
      enqueueSnackbar('Все стоп-слова успешно удалены', {
        variant: 'success',
      })
      return
    }
    if (VideoBlacklistClearQuery.isError) {
      enqueueSnackbar((VideoBlacklistClearQuery.error as ANY).data.message, {
        variant: 'error',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [VideoBlacklistClearQuery.isLoading])

  useEffect(() => {
    if (VideoBlacklistDeleteQuery.isSuccess) {
      enqueueSnackbar('Юзерагент успешно удален', {
        variant: 'success',
      })
      return
    }
    if (VideoBlacklistDeleteQuery.isError) {
      enqueueSnackbar((VideoBlacklistDeleteQuery.error as ANY).data.message, {
        variant: 'error',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [VideoBlacklistDeleteQuery.isLoading])

  useEffect(() => {
    if (VideoBlacklistDeleteBulkQuery.isSuccess) {
      enqueueSnackbar('Стоп-слова успешно удалены', {
        variant: 'success',
      })
      return
    }
    if (VideoBlacklistDeleteBulkQuery.isError) {
      enqueueSnackbar((VideoBlacklistDeleteBulkQuery.error as ANY).data.message, {
        variant: 'error',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [VideoBlacklistDeleteBulkQuery.isLoading])

  const orderOptions: OrderOptions<VideoBlacklistModel> = {
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
    limit: videoBlacklistSearchQuery.data?.take ?? 1,
    page: videoBlacklistSearchQuery.data?.page ?? 1,
    total: videoBlacklistSearchQuery.data?.total ?? 0,
    onChangePage,
  }

  return (
    <AdminLayout title="Черный список видео">
      <PageHeader
        right={
          <Box sx={actionButtons}>
            <Button color="error" onClick={handleDeleteAll} variant="contained">
              Удалить все
            </Button>
            <AddButton text="Добавить" to={browseRoutes.videoBlacklist.create()} />
          </Box>
        }
        title="Черный список видео"
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
        text="Точно удалить все видео из черного списка?"
        title="Удалить видео из черного списка"
      />
    </AdminLayout>
  )
}

export default VideoBlacklistIndexPage
