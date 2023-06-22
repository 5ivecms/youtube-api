import { Grid, Paper } from '@mui/material'
import type { FC } from 'react'

import { PageHeader } from '../../../components/ui'
import { AdminLayout } from '../../../layouts'
import { CreateSafeWordsForm } from './components'

const SafeWordsCreatePage: FC = () => {
  return (
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
}

export default SafeWordsCreatePage
