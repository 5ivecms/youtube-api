import type { ReactNode } from 'react'

export interface InfoTableColumn {
  field: string
  headerName: string
  render?: (data: any) => ReactNode
  width?: string
}
