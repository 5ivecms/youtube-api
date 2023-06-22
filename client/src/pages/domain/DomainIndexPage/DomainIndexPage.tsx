import { Box, Button, SxProps } from '@mui/material'
import { createColumnHelper } from '@tanstack/react-table'
import { useSnackbar } from 'notistack'
import { FC, useEffect, useState } from 'react'

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
import { DomainService } from '../../../core/services/domain'
import { ANY } from '../../../core/types'
import { DomainModel } from '../../../core/types/domain'
import { Order, SearchQueryParams } from '../../../core/types/search'
import { AdminLayout } from '../../../layouts'

const actionButtons: SxProps = {
  '& > button, & > a': { ml: 1 },
  whiteSpace: 'nowrap',
}

const columnHelper = createColumnHelper<DomainModel>()

const columns = [
  columnHelper.accessor('id', {
    cell: (info) => info.getValue(),
    header: () => 'ID',
    minSize: 200,
    size: 200,
  }),
  columnHelper.accessor('domain', {
    cell: (info) => info.getValue(),
    header: () => 'Домен',
    size: 2000,
  }),
  columnHelper.accessor('apiKey.apiKey', {
    cell: ({ row }) => row.original.apiKey.apiKey,
    header: () => 'ApiKey',
    size: 340,
  }),
]

const filters: DataGridFilterDef<DomainModel>[] = [
  { name: 'id', placeholder: 'id', type: 'text' },
  { name: 'domain', placeholder: 'Домен', type: 'text' },
  { name: 'apiKey.apiKey', placeholder: 'ApiKey', type: 'text' },
]

const DomainIndexPage: FC = () => {
  const { enqueueSnackbar } = useSnackbar()
  const relations = getRelations(filters)

  const [params, setParams] = useState<SearchQueryParams<DomainModel>>({ relations })
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false)

  const domainSearchQuery = DomainService.useSearchQuery(params)
  const [deleteDomain, domainDeleteQuery] = DomainService.useDeleteMutation()
  const [deleteBulkDomains, domainsDeleteBulkQuery] = DomainService.useDeleteBulkMutation()
  const [clearDomains, domainsClearQuery] = DomainService.useClearMutation()

  const items = domainSearchQuery.data?.items ?? []
  const tableIsLoading =
    domainSearchQuery.isFetching ||
    domainDeleteQuery.isLoading ||
    domainsDeleteBulkQuery.isLoading ||
    domainsClearQuery.isLoading

  const handleDelete = async (id: number) => {
    deleteDomain(Number(id))
  }

  const handleDeleteMany = (ids: number[]) => {
    deleteBulkDomains(ids.map(Number))
  }

  const handleDeleteAll = (): void => {
    setShowDeleteDialog(true)
  }

  const handleConfirmDeleteAll = (): void => {
    clearDomains()
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

  const onChangeOrderBy = (orderBy: keyof DomainModel) => {
    setParams((prevParams) => ({ ...prevParams, orderBy }))
  }

  const onChangeFilter = (filter: Record<keyof DomainModel, string>) => {
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
    if (domainsClearQuery.isSuccess) {
      enqueueSnackbar('Все домены успешно удалены', {
        variant: 'success',
      })
      return
    }
    if (domainsClearQuery.isError) {
      enqueueSnackbar((domainsClearQuery.error as ANY).data.message, {
        variant: 'error',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [domainsClearQuery.isLoading])

  useEffect(() => {
    if (domainDeleteQuery.isSuccess) {
      enqueueSnackbar('Домен успешно удален', {
        variant: 'success',
      })
      return
    }
    if (domainDeleteQuery.isError) {
      enqueueSnackbar((domainDeleteQuery.error as ANY).data.message, {
        variant: 'error',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [domainDeleteQuery.isLoading])

  useEffect(() => {
    if (domainsDeleteBulkQuery.isSuccess) {
      enqueueSnackbar('Домены успешно удалены', {
        variant: 'success',
      })
      return
    }
    if (domainsDeleteBulkQuery.isError) {
      enqueueSnackbar((domainsDeleteBulkQuery.error as ANY).data.message, {
        variant: 'error',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [domainsDeleteBulkQuery.isLoading])

  const orderOptions: OrderOptions<DomainModel> = {
    order: params?.order ?? 'asc',
    orderBy: params?.orderBy ?? 'id',
    onChangeOrder,
    onChangeOrderBy,
  }

  const paginationOptions: PaginationOptions = {
    limit: domainSearchQuery.data?.take ?? 1,
    page: domainSearchQuery.data?.page ?? 1,
    total: domainSearchQuery.data?.total ?? 0,
    onChangePage,
  }

  const filterOptions: FilterOptions = {
    filter: {},
    onChangeFilter,
  }

  return (
    <AdminLayout title="Домены">
      <PageHeader
        right={
          <Box sx={actionButtons}>
            <Button color="error" onClick={handleDeleteAll} variant="contained">
              Удалить все
            </Button>
            <AddButton text="Добавить" to={browseRoutes.domain.create()} />
          </Box>
        }
        title="Домены"
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
        text="Точно удалить все домены?"
        title="Удалить все домены"
      />
    </AdminLayout>
  )
}

export default DomainIndexPage
