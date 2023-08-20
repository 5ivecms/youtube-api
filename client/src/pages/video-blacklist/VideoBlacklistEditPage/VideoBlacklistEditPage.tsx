import { Alert, Grid, Paper } from '@mui/material'
import { useParams } from 'react-router-dom'

import { PageContent } from '../../../components/common'
import { PageHeader } from '../../../components/ui'
import { VideoBlacklistService } from '../../../core/services/video-blacklist'
import { ANY } from '../../../core/types'
import { AdminLayout } from '../../../layouts'
import { VideoBlacklistForm } from './components'

const VideoBlacklistEditPage = () => {
  const params = useParams()
  const { id } = params
  const { data, isLoading, isError, error } = VideoBlacklistService.useFindOneQuery(Number(id))

  const title = `Редактировать стоп-слово: ${data?.videoId}`

  return (
    <AdminLayout title={title}>
      <PageContent loading={isLoading}>
        {isError && error && <Alert severity="error">{(error as ANY)?.data.message}</Alert>}
        {data && <PageHeader title={title} showBackButton />}
        <Grid spacing={2} container>
          <Grid xs={6} item>
            <Paper sx={{ p: 3 }}>{data && <VideoBlacklistForm videoBlacklist={data} />}</Paper>
          </Grid>
        </Grid>
      </PageContent>
    </AdminLayout>
  )
}

export default VideoBlacklistEditPage
