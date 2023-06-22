import { Delete, Edit } from '@mui/icons-material'
import { Alert, Box, Button, SxProps } from '@mui/material'
import { useSnackbar } from 'notistack'
import { FC, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { DeleteDialog, InfoTable, PageContent } from '../../../components/common'
import { InfoTableColumn } from '../../../components/common/InfoTable/info-table.interfaces'
import { PageHeader } from '../../../components/ui'
import { browseRoutes } from '../../../core/config/routes.config'
import { DomainService } from '../../../core/services/domain'
import { ANY } from '../../../core/types'
import { AdminLayout } from '../../../layouts'

const actionButtons: SxProps = {
  '& > button': { ml: 1 },
  whiteSpace: 'nowrap',
}

const columns: InfoTableColumn[] = [
  { field: 'id', headerName: 'ID' },
  { field: 'domain', headerName: 'Домен' },
]

const DomainViewPage: FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()

  const domainFindOneQuery = DomainService.useFindOneQuery(Number(id))
  const [domainDelete, domainDeleteQuery] = DomainService.useDeleteMutation()

  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false)

  const handleDelete = (): void => {
    setShowDeleteDialog(true)
  }

  const confirmDeleteUseragent = async (): Promise<void> => {
    if (domainFindOneQuery.data?.id) {
      domainDelete(domainFindOneQuery.data.id)
    }
    setShowDeleteDialog(false)
  }

  useEffect(() => {
    if (domainDeleteQuery.isSuccess) {
      enqueueSnackbar('Домен успешно удален', {
        variant: 'success',
      })
      navigate(browseRoutes.domain.index())
      return
    }

    if (domainDeleteQuery.isError) {
      enqueueSnackbar((domainDeleteQuery.error as ANY).data.message, {
        variant: 'error',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [domainDeleteQuery.isLoading])

  return (
    <AdminLayout title={`Домен: ${domainFindOneQuery?.data?.domain ?? ''}`}>
      <PageContent loading={domainFindOneQuery.isLoading}>
        {domainFindOneQuery.isError && domainFindOneQuery.error && (
          <Alert severity="error">{(domainFindOneQuery.error as ANY)?.data.message}</Alert>
        )}

        {domainFindOneQuery.data && (
          <PageHeader
            title={domainFindOneQuery.data.domain}
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

        <InfoTable columns={columns} data={domainFindOneQuery.data} thWidth={200} />
      </PageContent>

      <DeleteDialog
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDeleteUseragent}
        open={showDeleteDialog}
        text="Точно удалить домен?"
        title="Удалить домен"
      />
    </AdminLayout>
  )
}

export default DomainViewPage
