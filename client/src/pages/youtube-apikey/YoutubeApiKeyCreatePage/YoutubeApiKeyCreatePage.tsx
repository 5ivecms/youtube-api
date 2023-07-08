import { Grid, Paper } from '@mui/material'

import { PageHeader } from '../../../components/ui'
import { AdminLayout } from '../../../layouts'
import { CreateYoutubeApiKeyForm } from './components'

const YoutubeApiKeyCreatePage = () => {
  return (
    <AdminLayout title="Создать Youtube API KEY">
      <PageHeader title="Создать Youtube API KEY" showBackButton />
      <Grid spacing={2} container>
        <Grid xs={4} item>
          <Paper sx={{ p: 3 }}>
            <CreateYoutubeApiKeyForm />
          </Paper>
        </Grid>
      </Grid>
    </AdminLayout>
  )
}

export default YoutubeApiKeyCreatePage
