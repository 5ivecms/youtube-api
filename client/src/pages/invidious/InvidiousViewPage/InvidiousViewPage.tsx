import { Delete, Edit } from '@mui/icons-material'
import { Alert, Box, Button } from '@mui/material'
import { useSnackbar } from 'notistack'
import { FC, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { DeleteDialog, InfoTable, PageContent } from '../../../components/common'
import type { InfoTableColumn } from '../../../components/common/InfoTable/info-table.interfaces'
import { PageHeader } from '../../../components/ui'
import { browseRoutes } from '../../../core/config/routes.config'
import { InvidiousService } from '../../../core/services/invidious'
import { ANY } from '../../../core/types'
import { AdminLayout } from '../../../layouts'
import { Logs } from './components'
import { actionButtons } from './styles'

const columns: InfoTableColumn[] = [
  { field: 'id', headerName: 'ID' },
  { field: 'host', headerName: 'Хост' },
  { field: 'pingMin', headerName: 'Минимальный пинг' },
  { field: 'pingMax', headerName: 'Максимальный пинг' },
  { field: 'pingAvg', headerName: 'Средний пинг' },
  { field: 'comment', headerName: 'Комментарий' },
]

const InvidiousViewPage: FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()

  const invidiousFindOneQuery = InvidiousService.useFindOneQuery(Number(id))
  const [invidiousDelete, invidiousDeleteQuery] = InvidiousService.useDeleteMutation()
  const invidiousLogsQuery = InvidiousService.useGetLogsQuery(Number(id))

  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false)

  const handleDelete = (): void => {
    setShowDeleteDialog(true)
  }

  const confirmDelete = async (): Promise<void> => {
    if (invidiousFindOneQuery.data?.id) {
      invidiousDelete(invidiousFindOneQuery.data?.id)
    }
    setShowDeleteDialog(false)
    navigate(browseRoutes.invidious.index())
  }

  useEffect(() => {
    if (invidiousDeleteQuery.isSuccess) {
      enqueueSnackbar('Invidious хост успешно удален', {
        variant: 'success',
      })
      navigate(browseRoutes.invidious.index())
      return
    }

    if (invidiousDeleteQuery.isError) {
      enqueueSnackbar((invidiousDeleteQuery.error as ANY).data.message, {
        variant: 'error',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invidiousDeleteQuery.isLoading])

  return (
    <AdminLayout title={`Invidious хост ${invidiousFindOneQuery?.data?.host}`}>
      <PageContent loading={invidiousDeleteQuery.isLoading || invidiousFindOneQuery.isLoading}>
        {invidiousFindOneQuery.isError && invidiousFindOneQuery.error && (
          <Alert severity="error">{(invidiousFindOneQuery.error as ANY)?.data.message}</Alert>
        )}

        {invidiousFindOneQuery.data && (
          <PageHeader
            title={invidiousFindOneQuery.data.host}
            right={
              <Box sx={actionButtons}>
                <Button component={Link} endIcon={<Edit />} to={browseRoutes.domain.edit(id)} variant="contained">
                  Редактировать
                </Button>
                <Button color="error" endIcon={<Delete />} onClick={handleDelete} variant="contained">
                  Удалить
                </Button>
              </Box>
            }
            showBackButton
          />
        )}

        <InfoTable columns={columns} data={invidiousFindOneQuery.data} thWidth={200} />
        <Logs
          logs={invidiousLogsQuery.data ?? []}
          loading={invidiousLogsQuery.isLoading || invidiousLogsQuery.isFetching}
        />
      </PageContent>

      <DeleteDialog
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDelete}
        open={showDeleteDialog}
        text="Точно удалить хост?"
        title="Удалить хост"
      />
    </AdminLayout>
  )
}

export default InvidiousViewPage
