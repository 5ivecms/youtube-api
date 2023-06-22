import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Button } from '@mui/material'
import { useSnackbar } from 'notistack'
import { FC, useEffect } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { object, string } from 'zod'

import { FormInput } from '../../../../../components/forms'
import { browseRoutes } from '../../../../../core/config/routes.config'
import { ApiKeyService } from '../../../../../core/services/apiKey'
import { ANY } from '../../../../../core/types'

type CreateApiKeyFields = {
  comment: string
}

const createApiKeySchema = object({
  comment: string().nonempty('Поле не может быть пустым'),
})

const CreateApiKeyForm: FC = () => {
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const [createApiKey, { isLoading, isError, error, isSuccess }] = ApiKeyService.useCreateMutation()
  const methods = useForm<CreateApiKeyFields>({ mode: 'onChange', resolver: zodResolver(createApiKeySchema) })

  const { handleSubmit } = methods

  const onSubmitHandler: SubmitHandler<CreateApiKeyFields> = (data) => {
    createApiKey(data)
  }

  useEffect(() => {
    if (isSuccess) {
      enqueueSnackbar('Api key создан', {
        variant: 'success',
      })
      navigate(browseRoutes.apiKey.index())
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
          placeholder="Комментарий"
          label="Комментарий"
          name="comment"
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

export default CreateApiKeyForm
