import { Delete, Edit } from '@mui/icons-material'
import { Alert, Box, Button, Chip, SxProps } from '@mui/material'
import { useSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { DeleteDialog, InfoTable, PageContent } from '../../../components/common'
import { InfoTableColumn } from '../../../components/common/InfoTable/info-table.interfaces'
import { PageHeader } from '../../../components/ui'
import { browseRoutes } from '../../../core/config/routes.config'
import { YoutubeApikeyService } from '../../../core/services/youtubeApikey'
import { ANY } from '../../../core/types'
import { AdminLayout } from '../../../layouts'

const actionButtons: SxProps = {
  '& > button': { ml: 1 },
  whiteSpace: 'nowrap',
}

const columns: InfoTableColumn[] = [
  { field: 'id', headerName: 'ID' },
  { field: 'apikey', headerName: 'ApiKey' },
  { field: 'currentUsage', headerName: 'Текущее использование' },
  { field: 'dailyLimit', headerName: 'Дневной лимит' },
  {
    field: 'hasError',
    headerName: 'Ошибка',
    render: (data) => {
      return <Chip color={data ? 'error' : 'success'} label={data ? 'Да' : 'Нет'} size="small" />
    },
  },
  { field: 'comment', headerName: 'Комментарий' },
]

const YoutubeApiKeyViewPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()

  const youtubeApiKeyFindOneQuery = YoutubeApikeyService.useFindOneQuery(Number(id))
  const [youtubeApiDelete, youtubeApiDeleteQuery] = YoutubeApikeyService.useDeleteMutation()

  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false)

  const handleDelete = (): void => {
    setShowDeleteDialog(true)
  }

  const confirmDelete = async (): Promise<void> => {
    if (youtubeApiKeyFindOneQuery.data?.id) {
      youtubeApiDelete(youtubeApiKeyFindOneQuery.data.id)
    }
    setShowDeleteDialog(false)
  }

  useEffect(() => {
    if (youtubeApiDeleteQuery.isSuccess) {
      enqueueSnackbar('Юзерагент успешно удален', {
        variant: 'success',
      })
      navigate(browseRoutes.youtubeApiKey.index())
      return
    }

    if (youtubeApiDeleteQuery.isError) {
      enqueueSnackbar((youtubeApiDeleteQuery.error as ANY).data.message, {
        variant: 'error',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [youtubeApiDeleteQuery.isLoading])

  return (
    <AdminLayout title={`Youtube API KEY: ${youtubeApiKeyFindOneQuery?.data?.apikey}`}>
      <PageContent loading={youtubeApiKeyFindOneQuery.isLoading}>
        {youtubeApiKeyFindOneQuery.isError ? (
          <Alert severity="error">{(youtubeApiKeyFindOneQuery.error as ANY)?.data.message}</Alert>
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
            <InfoTable columns={columns} data={youtubeApiKeyFindOneQuery.data} thWidth={200} />
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

export default YoutubeApiKeyViewPage
