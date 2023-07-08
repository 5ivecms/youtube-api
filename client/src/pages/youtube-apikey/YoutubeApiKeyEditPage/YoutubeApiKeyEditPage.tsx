import { Alert, Grid, Paper } from '@mui/material'
import { useParams } from 'react-router-dom'

import { PageContent } from '../../../components/common'
import { PageHeader } from '../../../components/ui'
import { YoutubeApikeyService } from '../../../core/services/youtubeApikey'
import { ANY } from '../../../core/types'
import { AdminLayout } from '../../../layouts'
import { EditForm } from './components'

const YoutubeApiKeyEditPage = () => {
  const params = useParams()
  const { id } = params
  const { data, isLoading, isError, error } = YoutubeApikeyService.useFindOneQuery(Number(id))

  return (
    <AdminLayout title={`Редактировать: ${data?.apikey}`}>
      <PageContent loading={isLoading}>
        {isError && error && <Alert severity="error">{(error as ANY)?.data.message}</Alert>}
        {data && <PageHeader title={data.apikey} showBackButton />}
        <Grid spacing={2} container>
          <Grid xs={6} item>
            <Paper sx={{ p: 3 }}>{data && <EditForm youtubeApiKey={data} />}</Paper>
          </Grid>
        </Grid>
      </PageContent>
    </AdminLayout>
  )
}

export default YoutubeApiKeyEditPage
