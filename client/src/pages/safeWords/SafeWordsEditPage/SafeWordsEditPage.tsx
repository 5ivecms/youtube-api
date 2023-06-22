import { Alert, Grid, Paper } from '@mui/material'
import type { FC } from 'react'
import { useParams } from 'react-router-dom'

import { PageContent } from '../../../components/common'
import { PageHeader } from '../../../components/ui'
import { SafeWordsService } from '../../../core/services/safeWords'
import { ANY } from '../../../core/types'
import { AdminLayout } from '../../../layouts'
import { EditSafeWordForm } from './components'

const SafeWordsEditPage: FC = () => {
  const params = useParams()
  const { id } = params
  const { data, isLoading, isError, error } = SafeWordsService.useFindOneQuery(Number(id))

  return (
    <AdminLayout title={`Редактировать стоп-слово: ${data?.phrase}`}>
      <PageContent loading={isLoading}>
        {isError && error && <Alert severity="error">{(error as ANY)?.data.message}</Alert>}
        {data && <PageHeader title={data.phrase} showBackButton />}
        <Grid spacing={2} container>
          <Grid xs={6} item>
            <Paper sx={{ p: 3 }}>{data && <EditSafeWordForm safeWord={data} />}</Paper>
          </Grid>
        </Grid>
      </PageContent>
    </AdminLayout>
  )
}

export default SafeWordsEditPage
