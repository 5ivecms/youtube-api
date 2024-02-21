import { Delete, Edit } from '@mui/icons-material'
import { Alert, Box, Button } from '@mui/material'
import { useSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { DeleteDialog, InfoTable, PageContent } from '../../../components/common'
import { InfoTableColumn } from '../../../components/common/InfoTable/info-table.interfaces'
import { PageHeader } from '../../../components/ui'
import { browseRoutes } from '../../../core/config/routes.config'
import { ChannelBlacklistService } from '../../../core/services/channel-blacklist'
import { ANY } from '../../../core/types'
import { AdminLayout } from '../../../layouts'
import { actionButtons } from './ChannelBlacklistView.styles'

const columns: InfoTableColumn[] = [
  { field: 'id', headerName: 'ID' },
  { field: 'channelId', headerName: 'ChannelId' },
]

const ChannelBlacklistViewPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()

  const channelBlacklistFindOneQuery = ChannelBlacklistService.useFindOneQuery(Number(id))
  const [channelBlacklistDelete, channelBlacklistDeleteQuery] = ChannelBlacklistService.useDeleteMutation()

  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false)

  const title = `Канал: ${channelBlacklistFindOneQuery?.data?.channelId}`

  const handleDelete = (): void => {
    setShowDeleteDialog(true)
  }

  const confirmDeleteChannelBlacklist = (): void => {
    if (channelBlacklistFindOneQuery.data?.id) {
      channelBlacklistDelete(channelBlacklistFindOneQuery.data?.id)
    }
    setShowDeleteDialog(false)
    navigate(browseRoutes.channelBlacklist.index())
  }

  useEffect(() => {
    if (channelBlacklistDeleteQuery.isSuccess) {
      enqueueSnackbar('Канал успешно удален из черного списка', { variant: 'success' })
      navigate(browseRoutes.channelBlacklist.index())
      return
    }

    if (channelBlacklistDeleteQuery.isError) {
      enqueueSnackbar((channelBlacklistDeleteQuery.error as ANY).data.message, { variant: 'error' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelBlacklistDeleteQuery.isLoading])

  return (
    <AdminLayout title={title}>
      <PageContent loading={channelBlacklistFindOneQuery.isLoading}>
        {channelBlacklistFindOneQuery.isError ? (
          <Alert severity="error">{(channelBlacklistFindOneQuery.error as ANY)?.data.message}</Alert>
        ) : (
          <>
            <PageHeader
              right={
                <Box sx={actionButtons}>
                  <Button
                    component={Link}
                    endIcon={<Edit />}
                    to={browseRoutes.channelBlacklist.edit(id)}
                    variant="contained"
                  >
                    Редактировать
                  </Button>
                  <Button color="error" endIcon={<Delete />} onClick={handleDelete} variant="contained">
                    Удалить
                  </Button>
                </Box>
              }
              title={title}
              showBackButton
            />
            <InfoTable columns={columns} data={channelBlacklistFindOneQuery.data} thWidth={200} />
          </>
        )}
      </PageContent>

      <DeleteDialog
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDeleteChannelBlacklist}
        open={showDeleteDialog}
        text="Точно удалить канал из черного списка?"
        title="Удалить канал из черного списка?"
      />
    </AdminLayout>
  )
}

export default ChannelBlacklistViewPage
