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
import { ApiKeyModel } from '../../../../../core/types/apiKey'

type EditApiKeyFields = {
  comment: string
}

interface EditApiKeyFormProps {
  apiKey: ApiKeyModel
}

const editApiKeySchema = object({
  comment: string().nonempty('Поле не может быть пустым'),
})

const EditApiKeyForm: FC<EditApiKeyFormProps> = ({ apiKey }) => {
  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()

  const [updateApiKey, { isSuccess, isLoading, isError, error }] = ApiKeyService.useUpdateMutation()

  const methods = useForm<EditApiKeyFields>({
    defaultValues: { comment: apiKey.comment },
    mode: 'onChange',
    resolver: zodResolver(editApiKeySchema),
  })

  const { handleSubmit } = methods

  const onSubmitHandler: SubmitHandler<EditApiKeyFields> = (data) => {
    updateApiKey({ id: apiKey.id, comment: data.comment })
  }

  useEffect(() => {
    if (isSuccess) {
      enqueueSnackbar('Api key успешно сохранен', {
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
          Сохранить
        </Button>
      </Box>
    </FormProvider>
  )
}

export default EditApiKeyForm
