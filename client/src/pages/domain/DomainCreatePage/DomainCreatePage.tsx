import { Grid, Paper } from '@mui/material'

import { PageHeader } from '../../../components/ui'
import { AdminLayout } from '../../../layouts'
import CreateDomainForm from './components/CreateDomainForm/CreateDomainForm'

const DomainCreatePage = () => {
  return (
    <AdminLayout title="Добавить домен">
      <PageHeader title="Добавить домен" showBackButton />
      <Grid spacing={2} container>
        <Grid xs={4} item>
          <Paper sx={{ p: 3 }}>
            <CreateDomainForm />
          </Paper>
        </Grid>
      </Grid>
    </AdminLayout>
  )
}

export default DomainCreatePage
