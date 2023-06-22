import { Delete, Edit } from '@mui/icons-material'
import { Alert, Box, Button } from '@mui/material'
import { useSnackbar } from 'notistack'
import { FC, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { DeleteDialog, InfoTable, PageContent } from '../../../components/common'
import type { InfoTableColumn } from '../../../components/common/InfoTable/info-table.interfaces'
import { PageHeader } from '../../../components/ui'
import { browseRoutes } from '../../../core/config/routes.config'
import { SafeWordsService } from '../../../core/services/safeWords'
import { ANY } from '../../../core/types'
import { AdminLayout } from '../../../layouts'
import { actionButtons } from './styles'

const columns: InfoTableColumn[] = [
  { field: 'id', headerName: 'ID' },
  { field: 'phrase', headerName: 'Фраза' },
]

const SafeWordsViewPage: FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()

  const safeWordFindOneQuery = SafeWordsService.useFindOneQuery(Number(id))
  const [safeWordDelete, safeWordDeleteQuery] = SafeWordsService.useDeleteMutation()

  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false)

  const handleDelete = (): void => {
    setShowDeleteDialog(true)
  }

  const confirmDeleteSafeWord = (): void => {
    if (safeWordFindOneQuery.data?.id) {
      safeWordDelete(safeWordFindOneQuery.data?.id)
    }
    setShowDeleteDialog(false)
    navigate(browseRoutes.safeWords.index())
  }

  useEffect(() => {
    if (safeWordDeleteQuery.isSuccess) {
      enqueueSnackbar('Стоп-слово успешно удален', {
        variant: 'success',
      })
      navigate(browseRoutes.useragent.index())
      return
    }

    if (safeWordDeleteQuery.isError) {
      enqueueSnackbar((safeWordDeleteQuery.error as ANY).data.message, {
        variant: 'error',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safeWordDeleteQuery.isLoading])

  return (
    <AdminLayout title={`Стоп-словоЖ ${safeWordFindOneQuery?.data?.phrase}`}>
      <PageContent loading={safeWordFindOneQuery.isLoading}>
        {safeWordFindOneQuery.isError ? (
          <Alert severity="error">{(safeWordFindOneQuery.error as ANY)?.data.message}</Alert>
        ) : (
          <>
            <PageHeader
              right={
                <Box sx={actionButtons}>
                  <Button component={Link} endIcon={<Edit />} to={browseRoutes.safeWords.edit(id)} variant="contained">
                    Редактировать
                  </Button>
                  <Button color="error" endIcon={<Delete />} onClick={handleDelete} variant="contained">
                    Удалить
                  </Button>
                </Box>
              }
              title={safeWordFindOneQuery.data?.phrase ?? 'Стоп-слово'}
              showBackButton
            />
            <InfoTable columns={columns} data={safeWordFindOneQuery.data} thWidth={200} />
          </>
        )}
      </PageContent>

      <DeleteDialog
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDeleteSafeWord}
        open={showDeleteDialog}
        text="Точно удалить стоп-слов?"
        title="Удалить стоп-слов"
      />
    </AdminLayout>
  )
}

export default SafeWordsViewPage
