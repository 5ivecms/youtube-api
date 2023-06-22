import { Alert, Grid, Paper } from '@mui/material'
import { FC } from 'react'
import { useParams } from 'react-router-dom'

import { PageContent } from '../../../components/common'
import { PageHeader } from '../../../components/ui'
import { ApiKeyService } from '../../../core/services/apiKey'
import { ANY } from '../../../core/types'
import { AdminLayout } from '../../../layouts'
import { EditApiKeyForm } from './components'

const ApiKeyEditPage: FC = () => {
  const params = useParams()
  const { id } = params
  const { data, isLoading, isError, error } = ApiKeyService.useFindOneQuery(Number(id))

  return (
    <AdminLayout title={`Редактировать: ${data?.apiKey}`}>
      <PageContent loading={isLoading}>
        {isError && error && <Alert severity="error">{(error as ANY)?.data.message}</Alert>}
        {data && <PageHeader title={data.apiKey} showBackButton />}
        <Grid spacing={2} container>
          <Grid xs={6} item>
            <Paper sx={{ p: 3 }}>{data && <EditApiKeyForm apiKey={data} />}</Paper>
          </Grid>
        </Grid>
      </PageContent>
    </AdminLayout>
  )
}

export default ApiKeyEditPage
