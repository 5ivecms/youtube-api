import { Delete, Edit } from '@mui/icons-material'
import { Alert, Box, Button, SxProps } from '@mui/material'
import { useSnackbar } from 'notistack'
import { FC, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { DeleteDialog, InfoTable, PageContent } from '../../../components/common'
import type { InfoTableColumn } from '../../../components/common/InfoTable/info-table.interfaces'
import { PageHeader } from '../../../components/ui'
import { browseRoutes } from '../../../core/config/routes.config'
import { ProxyService } from '../../../core/services/proxy'
import { ANY } from '../../../core/types'
import { AdminLayout } from '../../../layouts'

const actionButtons: SxProps = {
  '& > button': { ml: 1 },
  whiteSpace: 'nowrap',
}

const columns: InfoTableColumn[] = [
  { field: 'id', headerName: 'ID' },
  { field: 'ip', headerName: 'ip' },
  { field: 'port', headerName: 'Порт' },
  { field: 'login', headerName: 'Логин' },
  { field: 'password', headerName: 'Пароль' },
  { field: 'protocol', headerName: 'Протокол' },
  { field: 'comment', headerName: 'Коммент' },
]

const ProxyViewPage: FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()

  const proxyFindOneQuery = ProxyService.useFindOneQuery(Number(id))
  const [proxyDelete, proxyDeleteQuery] = ProxyService.useDeleteMutation()

  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false)

  const handleDelete = (): void => {
    setShowDeleteDialog(true)
  }

  const confirmDeleteSafeWord = (): void => {
    if (proxyFindOneQuery.data?.id) {
      proxyDelete(proxyFindOneQuery.data?.id)
    }
    setShowDeleteDialog(false)
    navigate(browseRoutes.proxy.index())
  }

  useEffect(() => {
    if (proxyDeleteQuery.isSuccess) {
      enqueueSnackbar('Прокси успешно удален', {
        variant: 'success',
      })
      navigate(browseRoutes.useragent.index())
      return
    }

    if (proxyDeleteQuery.isError) {
      enqueueSnackbar((proxyDeleteQuery.error as ANY).data.message, {
        variant: 'error',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proxyDeleteQuery.isLoading])

  return (
    <AdminLayout title={`Прокси ${proxyFindOneQuery?.data?.ip}:${proxyFindOneQuery?.data?.port}`}>
      <PageContent loading={proxyFindOneQuery.isLoading}>
        {proxyFindOneQuery.isError && proxyFindOneQuery.error && (
          <Alert severity="error">{(proxyFindOneQuery.error as ANY)?.data.message}</Alert>
        )}
        {proxyFindOneQuery.data && (
          <PageHeader
            right={
              <Box sx={actionButtons}>
                <Button component={Link} endIcon={<Edit />} to={browseRoutes.proxy.edit(id)} variant="contained">
                  Редактировать
                </Button>
                <Button color="error" endIcon={<Delete />} onClick={handleDelete} variant="contained">
                  Удалить
                </Button>
              </Box>
            }
            title={`${proxyFindOneQuery.data.ip}:${proxyFindOneQuery.data.port}`}
            showBackButton
          />
        )}
        <InfoTable columns={columns} data={proxyFindOneQuery.data} thWidth={200} />
      </PageContent>

      <DeleteDialog
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDeleteSafeWord}
        open={showDeleteDialog}
        text="Точно удалить прокси?"
        title="Удалить прокси"
      />
    </AdminLayout>
  )
}

export default ProxyViewPage
