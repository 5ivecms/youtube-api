import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import type { FC } from 'react'

interface DeleteDialogProps {
  onClose: () => void
  onConfirm: () => void
  open: boolean
  text: string
  title: string
}

const DeleteDialog: FC<DeleteDialogProps> = ({
  title = 'Удаление',
  text = 'Точно удалить?',
  open,
  onClose,
  onConfirm,
}) => {
  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{text}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button color="error" onClick={onConfirm} variant="contained" autoFocus>
          Удалить
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteDialog
