/* eslint-disable import/no-extraneous-dependencies */
import 'moment/locale/ru'

import { Box, Typography } from '@mui/material'
import moment from 'moment'
import { FC } from 'react'

import CustomTable from '../../../../../components/common/CustomTable/CustomTable'
import Preloader from '../../../../../components/ui/Preloader/Preloader'
import { LogsModel } from '../../../../../core/types/logs'
import { logsTitle } from '../../InvidiousViewPage.styles'
import { logsContainer } from './Logs.styles'

type LogsProps = {
  loading: boolean
  logs: LogsModel[]
}

const Logs: FC<LogsProps> = ({ loading, logs }) => {
  if (loading) {
    return <Preloader />
  }

  const data = logs.map((log) => ({ ...log, createdAt: moment(log.createdAt).format('DD.MM.YYYY, HH:mm:ss') }))

  return (
    <Box sx={logsContainer}>
      <Typography sx={logsTitle} variant="h5">
        Логи
      </Typography>
      <CustomTable
        columns={[
          { field: 'message', header: 'Ошибка' },
          { field: 'createdAt', header: 'Дата' },
        ]}
        data={data}
      />
    </Box>
  )
}

export default Logs
