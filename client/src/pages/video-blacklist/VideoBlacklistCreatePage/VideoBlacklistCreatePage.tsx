import { Grid, Paper } from '@mui/material'
import { useSnackbar } from 'notistack'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { PageHeader } from '../../../components/ui'
import { browseRoutes } from '../../../core/config/routes.config'
import { VideoBlacklistService } from '../../../core/services/video-blacklist'
import { ANY } from '../../../core/types'
import { AdminLayout } from '../../../layouts'
import { CreateVideoBlacklistForm } from './components'

const VideoBlacklistCreatePage = () => {
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()

  const [createVideoBlacklist, { isLoading, isError, error, isSuccess }] = VideoBlacklistService.useCreateMutation()

  const handleSubmit = (videoIds: string[]) => {
    createVideoBlacklist({ videoIds })
  }

  useEffect(() => {
    if (isSuccess) {
      enqueueSnackbar('Видео добалены в черный список', {
        variant: 'success',
      })
      navigate(browseRoutes.videoBlacklist.index())
      return
    }

    if (isError) {
      enqueueSnackbar((error as ANY).data.message, {
        variant: 'error',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading])

  return (
    <AdminLayout title="Добавить видео в черный список">
      <PageHeader title="Добавить видео в черный список" showBackButton />
      <Grid spacing={2} container>
        <Grid xs={4} item>
          <Paper sx={{ p: 3 }}>
            <CreateVideoBlacklistForm loading={isLoading} onSubmit={handleSubmit} />
          </Paper>
        </Grid>
      </Grid>
    </AdminLayout>
  )
}

export default VideoBlacklistCreatePage
