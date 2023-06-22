import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Button } from '@mui/material'
import { useSnackbar } from 'notistack'
import { useEffect } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { object, string } from 'zod'

import { FormInput } from '../../../../../components/forms'
import { browseRoutes } from '../../../../../core/config/routes.config'
import { UseragentService } from '../../../../../core/services/useragent'
import { ANY } from '../../../../../core/types'

type CreateUseragentsFields = {
  list: string
}

const createUseragentsSchema = object({
  list: string().nonempty('Поле не может быть пустым'),
})

const CreateUseragentsForm = () => {
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const [createUseragents, { isLoading, isError, error, isSuccess }] = UseragentService.useCreateMutation()
  const methods = useForm<CreateUseragentsFields>({ mode: 'onChange', resolver: zodResolver(createUseragentsSchema) })

  const { handleSubmit } = methods

  const onSubmitHandler: SubmitHandler<CreateUseragentsFields> = ({ list }) => {
    const useragents = list
      .split('\n')
      .map((item) => item.trim())
      .filter((item) => item.length)
    createUseragents({ useragents })
  }

  useEffect(() => {
    if (isSuccess) {
      enqueueSnackbar('Юзерагенты добавлены', {
        variant: 'success',
      })
      navigate(browseRoutes.useragent.index())
      return
    }

    if (isError) {
      enqueueSnackbar((error as ANY).data.message, {
        variant: 'error',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading])

  return (
    <FormProvider {...methods}>
      <Box autoComplete="off" component="form" onSubmit={handleSubmit(onSubmitHandler)} noValidate>
        <FormInput
          variant="outlined"
          placeholder="Список юзерагентов"
          label="Список юзерагентов"
          name="list"
          type="text"
          rows={5}
          multiline
          disabled={isLoading}
        />
        <Button disabled={isLoading} type="submit" variant="contained">
          Добавить
        </Button>
      </Box>
    </FormProvider>
  )
}

export default CreateUseragentsForm
