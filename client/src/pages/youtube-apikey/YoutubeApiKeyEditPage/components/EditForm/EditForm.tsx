import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Button, Grid } from '@mui/material'
import { useSnackbar } from 'notistack'
import { ChangeEvent, FC, useEffect } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { number, object, string } from 'zod'

import { FormInput } from '../../../../../components/forms'
import { browseRoutes } from '../../../../../core/config/routes.config'
import { YoutubeApikeyService } from '../../../../../core/services/youtubeApikey'
import { ANY } from '../../../../../core/types'
import { YoutubeApikeyModel } from '../../../../../core/types/youtubeApikey'

type EditApiKeyFields = Omit<YoutubeApikeyModel, 'id' | 'hasError'>

type EdidFormProps = {
  youtubeApiKey: YoutubeApikeyModel
}

const editApiKeySchema = object({
  apikey: string().nonempty('Поле не может быть пустым'),
  comment: string(),
  currentUsage: number(),
  dailyLimit: number(),
})

const EditForm: FC<EdidFormProps> = ({ youtubeApiKey }) => {
  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()

  const [updateApiKey, { isSuccess, isLoading, isError, error }] = YoutubeApikeyService.useUpdateMutation()

  const methods = useForm<EditApiKeyFields>({
    defaultValues: {
      comment: youtubeApiKey.comment,
      apikey: youtubeApiKey.apikey,
      currentUsage: youtubeApiKey.currentUsage,
      dailyLimit: youtubeApiKey.dailyLimit,
    },
    mode: 'onChange',
    resolver: zodResolver(editApiKeySchema),
  })

  const { handleSubmit, setValue } = methods

  const onSubmitHandler: SubmitHandler<EditApiKeyFields> = (data) => {
    updateApiKey({
      id: youtubeApiKey.id,
      comment: data.comment,
      currentUsage: Number(data.currentUsage),
      dailyLimit: Number(data.dailyLimit),
    })
  }

  const handleNumberChange = (event: ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name as keyof EditApiKeyFields
    setValue(name, Number(event.target.value))
  }

  useEffect(() => {
    if (isSuccess) {
      enqueueSnackbar('Api key успешно сохранен', {
        variant: 'success',
      })
      navigate(browseRoutes.youtubeApiKey.index())
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
          placeholder="API KEY"
          label="API KEY"
          name="apikey"
          type="text"
          disabled={isLoading}
        />
        <Grid container spacing={2}>
          <Grid xs={6} item>
            <FormInput
              variant="outlined"
              placeholder="Текущая квота"
              label="Текущая квота"
              name="currentUsage"
              type="number"
              disabled={isLoading}
              fullWidth
              inputProps={{ min: 0 }}
              onChange={handleNumberChange}
            />
          </Grid>
          <Grid xs={6} item>
            <FormInput
              variant="outlined"
              placeholder="Дневная квота"
              label="Дневная квота"
              name="dailyLimit"
              type="number"
              disabled={isLoading}
              fullWidth
              inputProps={{ min: 0 }}
              onChange={handleNumberChange}
            />
          </Grid>
        </Grid>
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

export default EditForm
