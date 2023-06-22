import { Grid, Paper } from '@mui/material'
import type { FC } from 'react'

import { PageHeader } from '../../../components/ui'
import { AdminLayout } from '../../../layouts'
import { CreateProxiesForm } from './components'

const ProxyCreatePage: FC = () => {
  return (
    <AdminLayout title="Добавить прокси">
      <PageHeader title="Добавить прокси" showBackButton />
      <Grid spacing={2} container>
        <Grid xs={4} item>
          <Paper sx={{ p: 3 }}>
            <CreateProxiesForm />
          </Paper>
        </Grid>
      </Grid>
    </AdminLayout>
  )
}

export default ProxyCreatePage
