import { Alert, Grid, Paper } from '@mui/material'
import { FC } from 'react'
import { useParams } from 'react-router-dom'

import { PageContent } from '../../../components/common'
import { PageHeader } from '../../../components/ui'
import { DomainService } from '../../../core/services/domain'
import { ANY } from '../../../core/types'
import { AdminLayout } from '../../../layouts'
import { EditDomainForm } from './components'

const DomainEditPage: FC = () => {
  const params = useParams()
  const { id } = params
  const { data, isLoading, isError, error } = DomainService.useFindOneQuery(Number(id))

  return (
    <AdminLayout title={`Редактировать: ${data?.domain}`}>
      <PageContent loading={isLoading}>
        {isError && error && <Alert severity="error">{(error as ANY)?.data.message}</Alert>}
        {data && <PageHeader title={data.domain} showBackButton />}
        <Grid spacing={2} container>
          <Grid xs={6} item>
            <Paper sx={{ p: 3 }}>{data && <EditDomainForm domain={data} />}</Paper>
          </Grid>
        </Grid>
      </PageContent>
    </AdminLayout>
  )
}

export default DomainEditPage
