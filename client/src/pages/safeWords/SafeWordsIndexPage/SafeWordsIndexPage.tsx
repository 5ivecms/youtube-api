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
import { SafeWordsService } from '../../../core/services/safeWords'
import { ANY } from '../../../core/types'
import type { SafeWordModel } from '../../../core/types/safeWords'
import { Order, SearchQueryParams } from '../../../core/types/search'
import { AdminLayout } from '../../../layouts'
import { actionButtons } from './styles'

const columnHelper = createColumnHelper<SafeWordModel>()

const columns = [
  columnHelper.accessor('id', {
    cell: (info) => info.getValue(),
    header: () => 'ID',
    minSize: 200,
    size: 200,
  }),
  columnHelper.accessor('phrase', {
    cell: (info) => info.getValue(),
    header: () => 'Название',
    size: 2000,
  }),
]

const filters: DataGridFilterDef<SafeWordModel>[] = [
  { name: 'id', placeholder: 'id', type: 'text' },
  { name: 'phrase', placeholder: 'Фраза', type: 'text' },
]

const SafeWordsIndexPage: FC = () => {
  const { enqueueSnackbar } = useSnackbar()
  const relations = getRelations(filters)

  const [params, setParams] = useState<SearchQueryParams<SafeWordModel>>({ relations })
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false)

  const safeWordsSearchQuery = SafeWordsService.useSearchQuery(params)
  const [deleteSafeWord, safeWordDeleteQuery] = SafeWordsService.useDeleteMutation()
  const [deleteBulkSafeWord, safeWordDeleteBulkQuery] = SafeWordsService.useDeleteBulkMutation()
  const [clearSafeWord, safeWordClearQuery] = SafeWordsService.useClearMutation()

  const items = safeWordsSearchQuery?.data?.items ?? []

  const tableIsLoading =
    safeWordsSearchQuery.isFetching ||
    safeWordDeleteQuery.isLoading ||
    safeWordDeleteBulkQuery.isLoading ||
    safeWordClearQuery.isLoading

  const handleDelete = (id: number): void => {
    deleteSafeWord(Number(id))
  }

  const handleDeleteMany = (ids: number[]): void => {
    deleteBulkSafeWord(ids.map(Number))
  }

  const handleDeleteAll = (): void => {
    setShowDeleteDialog(true)
  }

  const handleConfirmDeleteAll = (): void => {
    setShowDeleteDialog(false)
    clearSafeWord()
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

  const onChangeOrderBy = (orderBy: keyof SafeWordModel) => {
    setParams((prevParams) => ({ ...prevParams, orderBy }))
  }

  const onChangeFilter = (filter: Record<keyof SafeWordModel, string>) => {
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
    if (safeWordClearQuery.isSuccess) {
      enqueueSnackbar('Все стоп-слова успешно удалены', {
        variant: 'success',
      })
      return
    }
    if (safeWordClearQuery.isError) {
      enqueueSnackbar((safeWordClearQuery.error as ANY).data.message, {
        variant: 'error',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safeWordClearQuery.isLoading])

  useEffect(() => {
    if (safeWordDeleteQuery.isSuccess) {
      enqueueSnackbar('Юзерагент успешно удален', {
        variant: 'success',
      })
      return
    }
    if (safeWordDeleteQuery.isError) {
      enqueueSnackbar((safeWordDeleteQuery.error as ANY).data.message, {
        variant: 'error',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safeWordDeleteQuery.isLoading])

  useEffect(() => {
    if (safeWordDeleteBulkQuery.isSuccess) {
      enqueueSnackbar('Стоп-слова успешно удалены', {
        variant: 'success',
      })
      return
    }
    if (safeWordDeleteBulkQuery.isError) {
      enqueueSnackbar((safeWordDeleteBulkQuery.error as ANY).data.message, {
        variant: 'error',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safeWordDeleteBulkQuery.isLoading])

  const orderOptions: OrderOptions<SafeWordModel> = {
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
    limit: safeWordsSearchQuery.data?.take ?? 1,
    page: safeWordsSearchQuery.data?.page ?? 1,
    total: safeWordsSearchQuery.data?.total ?? 0,
    onChangePage,
  }

  return (
    <AdminLayout title="Список стоп-слов">
      <PageHeader
        right={
          <Box sx={actionButtons}>
            <Button color="error" onClick={handleDeleteAll} variant="contained">
              Удалить все
            </Button>
            <AddButton text="Добавить" to={browseRoutes.safeWords.create()} />
          </Box>
        }
        title="Стоп-слова"
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
        text="Точно удалить все стоп слова?"
        title="Удалить стоп-слова"
      />
    </AdminLayout>
  )
}

export default SafeWordsIndexPage
