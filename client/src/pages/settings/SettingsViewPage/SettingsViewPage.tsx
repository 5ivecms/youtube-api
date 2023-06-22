import { Alert, Button, Grid, Paper } from '@mui/material'
import { useSnackbar } from 'notistack'
import { FC, useEffect, useMemo } from 'react'

import { PageContent } from '../../../components/common'
import { PageHeader } from '../../../components/ui'
import { SettingsService } from '../../../core/services/settings'
import { ANY } from '../../../core/types'
import type { SettingsModel } from '../../../core/types/settings'
import { AdminLayout } from '../../../layouts'
import { SettingsForm } from './components'
import { paper } from './styles'

const SettingsViewPage: FC = () => {
  const { enqueueSnackbar } = useSnackbar()
  const settingsFindAllQuery = SettingsService.useFindAllQuery()
  const [updateBulk, settingsUpdateBulkQuery] = SettingsService.useUpdateBulkMutation()
  const [resetCache, resetCacheQuery] = SettingsService.useResetCacheMutation()

  const isLoading =
    settingsUpdateBulkQuery.isLoading || settingsFindAllQuery.isLoading || settingsFindAllQuery.isFetching

  const invidiousSettings = useMemo(
    () => (settingsFindAllQuery.data ?? []).filter((setting) => setting.section === 'invidious'),
    [settingsFindAllQuery.data]
  )

  const handleSubmit = ({ settings }: { settings: SettingsModel[] }): void => {
    updateBulk(settings.map((setting) => ({ ...setting, id: String(setting.id), value: String(setting.value) })))
  }

  const handleResetCache = () => {
    resetCache()
  }

  useEffect(() => {
    if (resetCacheQuery.isSuccess) {
      enqueueSnackbar('Кеш успешно сброшен', {
        variant: 'success',
      })
      return
    }
    if (resetCacheQuery.isError) {
      enqueueSnackbar((resetCacheQuery.error as ANY).data.message, {
        variant: 'error',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetCacheQuery.isLoading])

  return (
    <AdminLayout title="Настройки">
      <PageContent loading={settingsFindAllQuery.isLoading}>
        {settingsFindAllQuery.isError || !settingsFindAllQuery.data ? (
          <Alert severity="error">Ой, ой, ой... У нас ошибка!</Alert>
        ) : (
          <>
            <PageHeader title="Настройки" />
            <Grid spacing={2} container>
              <Grid xs={4} item>
                <Paper sx={paper}>
                  <SettingsForm
                    loading={isLoading}
                    onSubmit={handleSubmit}
                    settings={invidiousSettings}
                    title="Invidious"
                  />
                </Paper>
              </Grid>
              <Grid xs={4} item>
                <Paper sx={paper}>
                  <Button variant="contained" color="error" onClick={handleResetCache} title="Сбросить кеш">
                    Сбросить кеш
                  </Button>
                </Paper>
              </Grid>
            </Grid>
          </>
        )}
      </PageContent>
    </AdminLayout>
  )
}

export default SettingsViewPage
