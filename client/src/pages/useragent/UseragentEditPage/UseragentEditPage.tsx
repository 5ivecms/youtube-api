import { Alert, Grid, Paper } from '@mui/material'
import type { FC } from 'react'
import { useParams } from 'react-router-dom'

import { PageContent } from '../../../components/common'
import { PageHeader } from '../../../components/ui'
import { UseragentService } from '../../../core/services/useragent'
import { ANY } from '../../../core/types'
import { AdminLayout } from '../../../layouts'
import { EditUseragentForm } from './components'

const UseragentEditPage: FC = () => {
  const params = useParams()
  const { id } = params
  const { data, isLoading, isError, error } = UseragentService.useFindOneQuery(Number(id))

  return (
    <AdminLayout title={`Редактировать useragent ${data?.useragent}`}>
      <PageContent loading={isLoading}>
        {isError && error && <Alert severity="error">{(error as ANY)?.data.message}</Alert>}
        {data && <PageHeader title={data.useragent} showBackButton />}
        <Grid spacing={2} container>
          <Grid xs={12} item>
            <Paper sx={{ p: 3 }}>{data && <EditUseragentForm useragent={data} />}</Paper>
          </Grid>
        </Grid>
      </PageContent>
    </AdminLayout>
  )
}

export default UseragentEditPage
