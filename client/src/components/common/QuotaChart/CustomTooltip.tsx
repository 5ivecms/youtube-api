import { Paper } from '@mui/material'

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <Paper sx={{ px: 1.5, py: 1, backgroundColor: 'rgba(255, 255, 255, 0.7)' }}>
        <p>
          <b>Расход:</b> {`${payload[0].payload.quota}`}
        </p>
        <p>
          <b>Дата:</b> {`${payload[0].payload.date}`}
        </p>
      </Paper>
    )
  }

  return null
}

export default CustomTooltip
