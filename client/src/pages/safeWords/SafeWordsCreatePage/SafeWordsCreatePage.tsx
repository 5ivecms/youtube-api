import { Grid, Paper } from '@mui/material'

import { PageHeader } from '../../../components/ui'
import { AdminLayout } from '../../../layouts'
import { CreateSafeWordsForm } from './components'

const SafeWordsCreatePage = () => (
  <AdminLayout title="Добавить стоп-слово">
    <PageHeader title="Добавить стоп слова" showBackButton />
    <Grid spacing={2} container>
      <Grid xs={4} item>
        <Paper sx={{ p: 3 }}>
          <CreateSafeWordsForm />
        </Paper>
      </Grid>
    </Grid>
  </AdminLayout>
)

export default SafeWordsCreatePage
