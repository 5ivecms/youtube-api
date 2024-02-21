import { Alert, Grid, Paper } from '@mui/material'
import { useParams } from 'react-router-dom'

import { PageContent } from '../../../components/common'
import { PageHeader } from '../../../components/ui'
import { ChannelBlacklistService } from '../../../core/services/channel-blacklist'
import { ANY } from '../../../core/types'
import { AdminLayout } from '../../../layouts'
import { ChannelBlacklistForm } from './components'

const ChannelBlacklistEditPage = () => {
  const params = useParams()
  const { id } = params
  const { data, isLoading, isError, error } = ChannelBlacklistService.useFindOneQuery(Number(id))

  const title = `Редактировать канал: ${data?.channelId}`

  return (
    <AdminLayout title={title}>
      <PageContent loading={isLoading}>
        {isError && error && <Alert severity="error">{(error as ANY)?.data.message}</Alert>}
        {data && <PageHeader title={title} showBackButton />}
        <Grid spacing={2} container>
          <Grid xs={6} item>
            <Paper sx={{ p: 3 }}>{data && <ChannelBlacklistForm channelBlacklist={data} />}</Paper>
          </Grid>
        </Grid>
      </PageContent>
    </AdminLayout>
  )
}

export default ChannelBlacklistEditPage
