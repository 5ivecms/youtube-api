import { Grid, Paper } from '@mui/material'
import type { FC } from 'react'

import { PageHeader } from '../../../components/ui'
import { AdminLayout } from '../../../layouts'
import { CreateInvidiousForm } from './components'

const InvidiousCreatePage: FC = () => {
  return (
    <AdminLayout title="Добавить invidious хост">
      <PageHeader title="Хост" showBackButton />
      <Grid spacing={2} container>
        <Grid xs={4} item>
          <Paper sx={{ p: 3 }}>
            <CreateInvidiousForm />
          </Paper>
        </Grid>
      </Grid>
    </AdminLayout>
  )
}

export default InvidiousCreatePage
