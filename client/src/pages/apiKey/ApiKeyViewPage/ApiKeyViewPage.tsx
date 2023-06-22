import { Delete, Edit } from '@mui/icons-material'
import { Alert, Box, Button, SxProps } from '@mui/material'
import { useSnackbar } from 'notistack'
import { FC, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { DeleteDialog, InfoTable, PageContent } from '../../../components/common'
import { InfoTableColumn } from '../../../components/common/InfoTable/info-table.interfaces'
import { PageHeader } from '../../../components/ui'
import { browseRoutes } from '../../../core/config/routes.config'
import { ApiKeyService } from '../../../core/services/apiKey'
import { ANY } from '../../../core/types'
import { AdminLayout } from '../../../layouts'

const actionButtons: SxProps = {
  '& > button': { ml: 1 },
  whiteSpace: 'nowrap',
}

const columns: InfoTableColumn[] = [
  { field: 'id', headerName: 'ID' },
  { field: 'apiKey', headerName: 'ApiKey' },
]

const ApiKeyViewPage: FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()

  const apiKeyFindOneQuery = ApiKeyService.useFindOneQuery(Number(id))
  const [apiKeyDelete, apiKeyDeleteQuery] = ApiKeyService.useDeleteMutation()

  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false)

  const handleDelete = (): void => {
    setShowDeleteDialog(true)
  }

  const confirmDelete = async (): Promise<void> => {
    if (apiKeyFindOneQuery.data?.id) {
      apiKeyDelete(apiKeyFindOneQuery.data.id)
    }
    setShowDeleteDialog(false)
  }

  useEffect(() => {
    if (apiKeyDeleteQuery.isSuccess) {
      enqueueSnackbar('Юзерагент успешно удален', {
        variant: 'success',
      })
      navigate(browseRoutes.apiKey.index())
      return
    }

    if (apiKeyDeleteQuery.isError) {
      enqueueSnackbar((apiKeyDeleteQuery.error as ANY).data.message, {
        variant: 'error',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKeyDeleteQuery.isLoading])

  return (
    <AdminLayout title={`API KEY: ${apiKeyFindOneQuery?.data?.apiKey}`}>
      <PageContent loading={apiKeyFindOneQuery.isLoading}>
        {apiKeyFindOneQuery.isError ? (
          <Alert severity="error">{(apiKeyFindOneQuery.error as ANY)?.data.message}</Alert>
        ) : (
          <>
            <PageHeader
              right={
                <Box sx={actionButtons}>
                  <Button component={Link} endIcon={<Edit />} to={browseRoutes.apiKey.edit(id)} variant="contained">
                    Редактировать
                  </Button>
                  <Button color="error" endIcon={<Delete />} onClick={handleDelete} variant="contained">
                    Удалить
                  </Button>
                </Box>
              }
              title="Юзерагент"
              showBackButton
            />
            <InfoTable columns={columns} data={apiKeyFindOneQuery.data} thWidth={200} />
          </>
        )}
      </PageContent>

      <DeleteDialog
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDelete}
        open={showDeleteDialog}
        text="Точно удалить api key?"
        title="Удалить api key"
      />
    </AdminLayout>
  )
}

export default ApiKeyViewPage
