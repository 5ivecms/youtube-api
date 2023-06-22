import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Button } from '@mui/material'
import { useSnackbar } from 'notistack'
import type { FC } from 'react'
import { useEffect } from 'react'
import type { SubmitHandler } from 'react-hook-form'
import { FormProvider, useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'
import { object, string } from 'zod'

import { useLoginMutation } from '../../../core/services/auth'
import type { ANY, LoginFields } from '../../../core/types'
import { FormInput } from '../../forms'

const loginSchema = object({
  email: string().min(1, 'Email не может быть пустым').email('Email некорректный'),
  password: string()
    .min(1, 'Пароль не может быть пустым')
    .min(3, 'Пароль не может быть менее 3 символов')
    .max(32, 'Пароль не может быть длиннее 32 символов'),
})

const LoginForm: FC = () => {
  const { enqueueSnackbar } = useSnackbar()
  const methods = useForm<LoginFields>({ mode: 'onChange', resolver: zodResolver(loginSchema) })

  const [login, { isLoading, isError, error, isSuccess }] = useLoginMutation()

  const navigate = useNavigate()
  const location = useLocation()

  const from = (location?.state?.from.pathname as string) || '/invidious'

  const {
    reset,
    handleSubmit,
    formState: { isSubmitSuccessful },
  } = methods

  const onSubmitHandler: SubmitHandler<LoginFields> = (values): void => {
    login(values)
  }

  useEffect(() => {
    if (isSuccess) {
      enqueueSnackbar('Успешная авторизация', {
        variant: 'success',
      })
      navigate(from)
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading])

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitSuccessful])

  return (
    <FormProvider {...methods}>
      <Box autoComplete="off" component="form" onSubmit={handleSubmit(onSubmitHandler)} noValidate>
        <FormInput name="email" label="Email" placeholder="Email" type="email" />
        <FormInput name="password" label="Пароль" placeholder="Пароль" type="password" />
        <Button disabled={isLoading} type="submit" variant="contained" disableElevation fullWidth>
          Войти
        </Button>
      </Box>
    </FormProvider>
  )
}

export default LoginForm
