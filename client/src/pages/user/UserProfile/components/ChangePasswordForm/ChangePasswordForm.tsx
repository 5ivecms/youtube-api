import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Button } from '@mui/material'
import { useSnackbar } from 'notistack'
import { useEffect } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { object, string } from 'zod'

import { FormInput } from '../../../../../components/forms'
import { useChangePasswordMutation } from '../../../../../core/services'
import { ANY } from '../../../../../core/types'
import { ChangePasswordFormFields } from '../../../../../core/types/auth'

const resetPasswordSchema = object({
  oldPassword: string().nonempty('Поле не может быть пустым'),
  newPassword: string().nonempty('Поле не может быть пустым'),
})

const ChangePasswordForm = () => {
  const { enqueueSnackbar } = useSnackbar()

  const methods = useForm<ChangePasswordFormFields>({
    mode: 'onChange',
    resolver: zodResolver(resetPasswordSchema),
  })

  const { handleSubmit, reset } = methods

  const [changePassword, { isLoading, isError, error, isSuccess }] = useChangePasswordMutation()

  const onSubmitHandler: SubmitHandler<ChangePasswordFormFields> = (data) => {
    changePassword(data)
  }

  useEffect(() => {
    if (isSuccess) {
      enqueueSnackbar('Пароль успешно изменен', {
        variant: 'success',
      })
    }
    if (isError) {
      if (Array.isArray((error as ANY).data.error)) {
        ;(error as ANY).data.error.forEach((el: ANY) => {
          enqueueSnackbar(el?.message, {
            variant: 'error',
          })
        })
      } else {
        enqueueSnackbar((error as ANY).data.message, {
          variant: 'error',
        })
      }
    }
    reset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading])

  return (
    <>
      <FormProvider {...methods}>
        <Box autoComplete="off" component="form" onSubmit={handleSubmit(onSubmitHandler)} noValidate>
          <FormInput
            variant="outlined"
            label="Старый пароль"
            name="oldPassword"
            type="password"
            placeholder="Старый пароль"
            disabled={false}
          />
          <FormInput
            variant="outlined"
            label="Новый пароль"
            name="newPassword"
            type="password"
            placeholder="Новый пароль"
            disabled={false}
          />
          <Button disabled={false} type="submit" variant="contained">
            Сменить пароль
          </Button>
        </Box>
      </FormProvider>
    </>
  )
}

export default ChangePasswordForm
