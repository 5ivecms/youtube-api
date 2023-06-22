import { Alert, Grid, Paper } from '@mui/material'
import type { FC } from 'react'
import { useParams } from 'react-router-dom'

import { PageContent } from '../../../components/common'
import { PageHeader } from '../../../components/ui'
import { ProxyService } from '../../../core/services/proxy'
import { ANY } from '../../../core/types'
import { AdminLayout } from '../../../layouts'
import { EditProxyForm } from './components'
import { paper } from './styles'

const ProxyEditPage: FC = () => {
  const params = useParams()
  const { id } = params
  const { data, isLoading, isError, error } = ProxyService.useFindOneQuery(Number(id))

  return (
    <AdminLayout title={`Редактировать прокси: ${data?.ip}:${data?.port}`}>
      <PageContent loading={isLoading}>
        {isError && error && <Alert severity="error">{(error as ANY)?.data.message}</Alert>}
        {data && <PageHeader title={`${data.ip}:${data.port}`} showBackButton />}
        {data && (
          <Grid spacing={2} container>
            <Grid xs={6} item>
              <Paper sx={paper}>
                <EditProxyForm proxy={data} />
              </Paper>
            </Grid>
          </Grid>
        )}
      </PageContent>
    </AdminLayout>
  )
}

export default ProxyEditPage
