/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/prop-types */

import { Box, Stack, Typography } from '@mui/material'
import moment from 'moment'
import { useState } from 'react'

import { PageContent, QuotaChart } from '../../../components/common'
import { DateRange, getThisMonth, InputDateRangePicker } from '../../../components/forms/InputDateRangePicker'
import { PageHeader } from '../../../components/ui'
import { QuotaUsageService } from '../../../core/services/quotaUsage'
import { YoutubeApikeyService } from '../../../core/services/youtubeApikey'
import { AdminLayout } from '../../../layouts'
import { styles } from './HomePage.styles'

const HomePage = () => {
  const [dateRange, setDateRange] = useState<DateRange>(getThisMonth())
  const apikeyStatisticQuery = YoutubeApikeyService.useStatisitcQuery()
  const quotaUsageQuery = QuotaUsageService.useByPeriodQuery({
    startDate: moment(dateRange.startDate).format('YYYY-MM-DD') as unknown as Date,
    endDate: moment(dateRange.endDate).format('YYYY-MM-DD') as unknown as Date,
  })

  const statistic = apikeyStatisticQuery.data ?? { today: 0, total: 0 }
  const quotaUsage = quotaUsageQuery.data ?? []
  const chartData: { quota: number; date: string }[] = quotaUsage.map((item) => {
    return { quota: item.currentUsage, date: moment(item.date).format('DD.MM.YYYY') }
  })

  const handleApplyDate = (date: DateRange) => {
    setDateRange(date)
  }

  return (
    <AdminLayout title="Главная">
      <PageHeader title="Расход квоты" />
      <PageContent loading={quotaUsageQuery.isLoading || apikeyStatisticQuery.isLoading}>
        <Box sx={styles.head}>
          <InputDateRangePicker value={dateRange} onApply={handleApplyDate} />
          <Stack direction="row" spacing={3}>
            <Typography>
              <b>Расход сегодня:</b> {statistic.today.toLocaleString()}
            </Typography>
            <Typography>
              <b>Общий объем:</b> {statistic.total.toLocaleString()}
            </Typography>
          </Stack>
        </Box>
        <Box sx={styles.chartContainer}>
          <QuotaChart data={chartData} />
        </Box>
      </PageContent>
    </AdminLayout>
  )
}

export default HomePage
