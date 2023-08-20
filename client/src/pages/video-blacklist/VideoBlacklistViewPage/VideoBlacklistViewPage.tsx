import { Delete, Edit } from '@mui/icons-material'
import { Alert, Box, Button } from '@mui/material'
import { useSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { DeleteDialog, InfoTable, PageContent } from '../../../components/common'
import { InfoTableColumn } from '../../../components/common/InfoTable/info-table.interfaces'
import { PageHeader } from '../../../components/ui'
import { browseRoutes } from '../../../core/config/routes.config'
import { VideoBlacklistService } from '../../../core/services/video-blacklist'
import { ANY } from '../../../core/types'
import { AdminLayout } from '../../../layouts'
import { actionButtons } from './VideoBlacklistView.styles'

const columns: InfoTableColumn[] = [
  { field: 'id', headerName: 'ID' },
  { field: 'videoId', headerName: 'VideoId' },
]

const VideoBlacklistViewPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()

  const videoBlacklistFindOneQuery = VideoBlacklistService.useFindOneQuery(Number(id))
  const [videoBlacklistDelete, videoBlacklistDeleteQuery] = VideoBlacklistService.useDeleteMutation()

  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false)

  const title = `Видео: ${videoBlacklistFindOneQuery?.data?.videoId}`

  const handleDelete = (): void => {
    setShowDeleteDialog(true)
  }

  const confirmDeletevideoBlacklist = (): void => {
    if (videoBlacklistFindOneQuery.data?.id) {
      videoBlacklistDelete(videoBlacklistFindOneQuery.data?.id)
    }
    setShowDeleteDialog(false)
    navigate(browseRoutes.videoBlacklist.index())
  }

  useEffect(() => {
    if (videoBlacklistDeleteQuery.isSuccess) {
      enqueueSnackbar('Стоп-слово успешно удален', {
        variant: 'success',
      })
      navigate(browseRoutes.useragent.index())
      return
    }

    if (videoBlacklistDeleteQuery.isError) {
      enqueueSnackbar((videoBlacklistDeleteQuery.error as ANY).data.message, {
        variant: 'error',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoBlacklistDeleteQuery.isLoading])

  return (
    <AdminLayout title={title}>
      <PageContent loading={videoBlacklistFindOneQuery.isLoading}>
        {videoBlacklistFindOneQuery.isError ? (
          <Alert severity="error">{(videoBlacklistFindOneQuery.error as ANY)?.data.message}</Alert>
        ) : (
          <>
            <PageHeader
              right={
                <Box sx={actionButtons}>
                  <Button
                    component={Link}
                    endIcon={<Edit />}
                    to={browseRoutes.videoBlacklist.edit(id)}
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
            <InfoTable columns={columns} data={videoBlacklistFindOneQuery.data} thWidth={200} />
          </>
        )}
      </PageContent>

      <DeleteDialog
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDeletevideoBlacklist}
        open={showDeleteDialog}
        text="Точно удалить стоп-слов?"
        title="Удалить стоп-слов"
      />
    </AdminLayout>
  )
}

export default VideoBlacklistViewPage
