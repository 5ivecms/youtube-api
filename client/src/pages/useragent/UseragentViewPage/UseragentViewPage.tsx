import { Delete, Edit } from '@mui/icons-material'
import type { SxProps } from '@mui/material'
import { Alert, Box, Button } from '@mui/material'
import { useSnackbar } from 'notistack'
import { FC, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { DeleteDialog, InfoTable, PageContent } from '../../../components/common'
import type { InfoTableColumn } from '../../../components/common/InfoTable/info-table.interfaces'
import { PageHeader } from '../../../components/ui'
import { browseRoutes } from '../../../core/config/routes.config'
import { UseragentService } from '../../../core/services/useragent'
import { ANY } from '../../../core/types'
import { AdminLayout } from '../../../layouts'

const actionButtons: SxProps = {
  '& > button': { ml: 1 },
  whiteSpace: 'nowrap',
}

const columns: InfoTableColumn[] = [
  { field: 'id', headerName: 'ID' },
  { field: 'useragent', headerName: 'Useragent' },
]

const UseragentViewPage: FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()

  const useragentFindOneQuery = UseragentService.useFindOneQuery(Number(id))
  const [useragentDelete, useragentDeleteQuery] = UseragentService.useDeleteMutation()

  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false)

  const handleDelete = (): void => {
    setShowDeleteDialog(true)
  }

  const confirmDeleteUseragent = async (): Promise<void> => {
    if (useragentFindOneQuery.data?.id) {
      useragentDelete(useragentFindOneQuery.data.id)
    }
    setShowDeleteDialog(false)
  }

  useEffect(() => {
    if (useragentDeleteQuery.isSuccess) {
      enqueueSnackbar('Юзерагент успешно удален', {
        variant: 'success',
      })
      navigate(browseRoutes.useragent.index())
      return
    }

    if (useragentDeleteQuery.isError) {
      enqueueSnackbar((useragentDeleteQuery.error as ANY).data.message, {
        variant: 'error',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useragentDeleteQuery.isLoading])

  return (
    <AdminLayout title={`Useragent ${useragentFindOneQuery?.data?.useragent}`}>
      <PageContent loading={useragentFindOneQuery.isLoading}>
        {useragentFindOneQuery.isError ? (
          <Alert severity="error">{(useragentFindOneQuery.error as ANY)?.data.message}</Alert>
        ) : (
          <>
            <PageHeader
              right={
                <Box sx={actionButtons}>
                  <Button component={Link} endIcon={<Edit />} to={browseRoutes.useragent.edit(id)} variant="contained">
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
            <InfoTable columns={columns} data={useragentFindOneQuery.data} thWidth={200} />
          </>
        )}
      </PageContent>

      <DeleteDialog
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDeleteUseragent}
        open={showDeleteDialog}
        text="Точно удалить юзерагент?"
        title="Удалить юзерагент"
      />
    </AdminLayout>
  )
}

export default UseragentViewPage
