import { Grid, Paper } from '@mui/material'
import { useSnackbar } from 'notistack'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { PageHeader } from '../../../components/ui'
import { browseRoutes } from '../../../core/config/routes.config'
import { ChannelBlacklistService } from '../../../core/services/channel-blacklist'
import { ANY } from '../../../core/types'
import { AdminLayout } from '../../../layouts'
import { CreateChannelBlacklistForm } from './components'

const ChannelBlacklistCreatePage = () => {
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()

  const [createChannelBlacklist, { isLoading, isError, error, isSuccess }] = ChannelBlacklistService.useCreateMutation()

  const handleSubmit = (channelIds: string[]) => {
    createChannelBlacklist({ channelIds })
  }

  useEffect(() => {
    if (isSuccess) {
      enqueueSnackbar('Каналы добалены в черный список', { variant: 'success' })
      navigate(browseRoutes.channelBlacklist.index())
      return
    }

    if (isError) {
      enqueueSnackbar((error as ANY).data.message, { variant: 'error' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading])

  return (
    <AdminLayout title="Добавить каналы в черный список">
      <PageHeader title="Добавить каналы в черный список" showBackButton />
      <Grid spacing={2} container>
        <Grid xs={4} item>
          <Paper sx={{ p: 3 }}>
            <CreateChannelBlacklistForm loading={isLoading} onSubmit={handleSubmit} />
          </Paper>
        </Grid>
      </Grid>
    </AdminLayout>
  )
}

export default ChannelBlacklistCreatePage
