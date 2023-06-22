import { Box, Button } from '@mui/material'
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
import { UseragentService } from '../../../core/services/useragent'
import { ANY } from '../../../core/types'
import { Order, SearchQueryParams } from '../../../core/types/search'
import type { UseragentModel } from '../../../core/types/useragent'
import { AdminLayout } from '../../../layouts'
import { actionButtons } from './styles'

const columnHelper = createColumnHelper<UseragentModel>()

const columns = [
  columnHelper.accessor('id', {
    cell: (info) => info.getValue(),
    header: () => 'ID',
    minSize: 200,
    size: 200,
  }),
  columnHelper.accessor('useragent', {
    cell: (info) => info.getValue(),
    header: () => 'Название',
    size: 2000,
  }),
]

const filters: DataGridFilterDef<UseragentModel>[] = [
  { name: 'id', placeholder: 'id', type: 'text' },
  { name: 'useragent', placeholder: 'Название', type: 'text' },
]

const UseragentIndexPage: FC = () => {
  const { enqueueSnackbar } = useSnackbar()
  const relations = getRelations(filters)

  const [params, setParams] = useState<SearchQueryParams<UseragentModel>>({ relations })
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false)

  const useragentSearchQuery = UseragentService.useSearchQuery(params)
  const [deleteUseragent, useragentDeleteQuery] = UseragentService.useDeleteMutation()
  const [clearUseragents, useragentClearQuery] = UseragentService.useClearMutation()
  const [deleteBulkUseragents, useragentsDeleteBulkQuery] = UseragentService.useDeleteBulkMutation()

  const items = useragentSearchQuery.data?.items ?? []
  const tableIsLoading =
    useragentSearchQuery.isFetching ||
    useragentDeleteQuery.isLoading ||
    useragentsDeleteBulkQuery.isLoading ||
    useragentClearQuery.isLoading

  const handleDelete = async (id: number) => {
    deleteUseragent(Number(id))
  }

  const handleDeleteMany = (ids: number[]) => {
    deleteBulkUseragents(ids.map(Number))
  }

  const handleDeleteAll = (): void => {
    setShowDeleteDialog(true)
  }

  const handleConfirmDeleteAll = (): void => {
    clearUseragents()
    setShowDeleteDialog(false)
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

  const onChangeOrderBy = (orderBy: keyof UseragentModel) => {
    setParams((prevParams) => ({ ...prevParams, orderBy }))
  }

  const onChangeFilter = (filter: Record<keyof UseragentModel, string>) => {
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
    if (useragentClearQuery.isSuccess) {
      enqueueSnackbar('Все юзерагенты успешно удалены', {
        variant: 'success',
      })
      return
    }
    if (useragentClearQuery.isError) {
      enqueueSnackbar((useragentClearQuery.error as ANY).data.message, {
        variant: 'error',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useragentClearQuery.isLoading])

  useEffect(() => {
    if (useragentDeleteQuery.isSuccess) {
      enqueueSnackbar('Юзерагент успешно удален', {
        variant: 'success',
      })
      return
    }
    if (useragentDeleteQuery.isError) {
      enqueueSnackbar((useragentDeleteQuery.error as ANY).data.message, {
        variant: 'error',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useragentDeleteQuery.isLoading])

  useEffect(() => {
    if (useragentsDeleteBulkQuery.isSuccess) {
      enqueueSnackbar('Юзерагенты успешно удалены', {
        variant: 'success',
      })
      return
    }
    if (useragentsDeleteBulkQuery.isError) {
      enqueueSnackbar((useragentsDeleteBulkQuery.error as ANY).data.message, {
        variant: 'error',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useragentsDeleteBulkQuery.isLoading])

  const orderOptions: OrderOptions<UseragentModel> = {
    order: params?.order ?? 'asc',
    orderBy: params?.orderBy ?? 'id',
    onChangeOrder,
    onChangeOrderBy,
  }

  const paginationOptions: PaginationOptions = {
    limit: useragentSearchQuery.data?.take ?? 1,
    page: useragentSearchQuery.data?.page ?? 1,
    total: useragentSearchQuery.data?.total ?? 0,
    onChangePage,
  }

  const filterOptions: FilterOptions = {
    filter: {},
    onChangeFilter,
  }

  return (
    <AdminLayout title="Список useragents">
      <PageHeader
        right={
          <Box sx={actionButtons}>
            <Button color="error" onClick={handleDeleteAll} variant="contained">
              Удалить все
            </Button>
            <AddButton text="Добавить" to={browseRoutes.useragent.create()} />
          </Box>
        }
        title="Юзерагенты"
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
        text="Точно удалить все юзерагенты?"
        title="Удалить все юзерагенты"
      />
    </AdminLayout>
  )
}

export default UseragentIndexPage
