import { FC } from 'react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import CustomTooltip from './CustomTooltip'
import { QuotaChartData } from './types'

type QuotaChartProps = {
  data: QuotaChartData
}

const QuotaChart: FC<QuotaChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer>
      <AreaChart
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip content={<CustomTooltip active={undefined} payload={undefined} label={undefined} />} />
        <Area type="monotone" dataKey="quota" stroke="#8884d8" fill="#8884d8" />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export default QuotaChart
