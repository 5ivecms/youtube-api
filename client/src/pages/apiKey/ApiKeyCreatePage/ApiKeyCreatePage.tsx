import { Grid, Paper } from '@mui/material'
import { FC } from 'react'

import { PageHeader } from '../../../components/ui'
import { AdminLayout } from '../../../layouts'
import { CreateApiKeyForm } from './components'

const ApiKeyCreatePage: FC = () => {
  return (
    <AdminLayout title="Создать API KEY">
      <PageHeader title="Создать API KEY" showBackButton />
      <Grid spacing={2} container>
        <Grid xs={4} item>
          <Paper sx={{ p: 3 }}>
            <CreateApiKeyForm />
          </Paper>
        </Grid>
      </Grid>
    </AdminLayout>
  )
}

export default ApiKeyCreatePage
