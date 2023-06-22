import { Alert, Grid, Paper } from '@mui/material'
import type { FC } from 'react'
import { useParams } from 'react-router-dom'

import { PageContent } from '../../../components/common'
import { PageHeader } from '../../../components/ui'
import { InvidiousService } from '../../../core/services/invidious'
import { ANY } from '../../../core/types'
import { AdminLayout } from '../../../layouts'
import { EditInvidiousForm } from './components'

const InvidiousEditPage: FC = () => {
  const params = useParams()
  const { id } = params

  const { data, isLoading, isError, error } = InvidiousService.useFindOneQuery(Number(id))

  return (
    <AdminLayout title={`Редактировать ${data?.host}`}>
      <PageContent loading={isLoading}>
        {isError && error && <Alert severity="error">{(error as ANY)?.data.message}</Alert>}
        {data && <PageHeader title={data.host} showBackButton />}
        <Grid spacing={2} container>
          <Grid xs={7} item>
            <Paper sx={{ p: 3 }}>{data && <EditInvidiousForm invidious={data} />}</Paper>
          </Grid>
        </Grid>
      </PageContent>
    </AdminLayout>
  )
}

export default InvidiousEditPage
