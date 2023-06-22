import { Add } from '@mui/icons-material'
import { Button } from '@mui/material'
import type { FC } from 'react'
import { Link } from 'react-router-dom'

export interface AddButtonProps {
  text: string
  to: string
}

const AddButton: FC<AddButtonProps> = ({ text, to }) => (
  <Button component={Link} endIcon={<Add />} to={to} variant="contained">
    {text}
  </Button>
)

export default AddButton
