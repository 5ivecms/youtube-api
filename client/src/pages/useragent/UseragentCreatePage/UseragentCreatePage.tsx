import { Grid, Paper } from '@mui/material'
import type { FC } from 'react'

import { PageHeader } from '../../../components/ui'
import { AdminLayout } from '../../../layouts'
import { CreateUseragentsForm } from './components'

const UseragentCreatePage: FC = () => {
  return (
    <AdminLayout title="Добавить useragent">
      <PageHeader title="Добавить useragent" showBackButton />
      <Grid spacing={2} container>
        <Grid xs={4} item>
          <Paper sx={{ p: 3 }}>
            <CreateUseragentsForm />
          </Paper>
        </Grid>
      </Grid>
    </AdminLayout>
  )
}

export default UseragentCreatePage
