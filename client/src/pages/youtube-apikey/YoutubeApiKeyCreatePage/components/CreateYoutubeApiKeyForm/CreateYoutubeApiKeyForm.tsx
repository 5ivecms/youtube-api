import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Button } from '@mui/material'
import { useSnackbar } from 'notistack'
import { ChangeEvent, useEffect } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { number, object, string } from 'zod'

import { FormInput } from '../../../../../components/forms'
import { browseRoutes } from '../../../../../core/config/routes.config'
import { YoutubeApikeyService } from '../../../../../core/services/youtubeApikey'
import { ANY } from '../../../../../core/types'

type CreateYoutubeApiKeyFields = {
  apikeys: string
  dailyLimit: number
  comment: string
}

const createYoutubeApiKeySchema = object({
  comment: string(),
  apikeys: string().nonempty('Поле не может быть пустым'),
  dailyLimit: number().default(1000),
})

const CreateYoutubeApiKeyForm = () => {
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const [createYoutubeApiKey, { isLoading, isError, error, isSuccess }] = YoutubeApikeyService.useCreateMutation()
  const methods = useForm<CreateYoutubeApiKeyFields>({
    mode: 'onChange',
    resolver: zodResolver(createYoutubeApiKeySchema),
    defaultValues: { dailyLimit: 10000 },
  })

  const { handleSubmit, setValue } = methods

  const onSubmitHandler: SubmitHandler<CreateYoutubeApiKeyFields> = (data) => {
    const apikeysList = data.apikeys
      .split('\n')
      .map((item) => item.trim())
      .filter((item) => item.length)
    createYoutubeApiKey({ apikeys: apikeysList, comment: data.comment, dailyLimit: Number(data.dailyLimit) })
  }

  const handleNumberChange = (event: ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name as keyof CreateYoutubeApiKeyFields
    setValue(name, Number(event.target.value))
  }

  useEffect(() => {
    if (isSuccess) {
      enqueueSnackbar('Api key создан', {
        variant: 'success',
      })
      navigate(browseRoutes.youtubeApiey.index())
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
          placeholder="API KEYS"
          label="API KEYS"
          name="apikeys"
          type="text"
          disabled={isLoading}
          multiline
          rows={5}
        />
        <FormInput
          variant="outlined"
          placeholder="Дневной лимит"
          label="Дневной лимит"
          name="dailyLimit"
          type="number"
          disabled={isLoading}
          onChange={handleNumberChange}
        />
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

export default CreateYoutubeApiKeyForm
