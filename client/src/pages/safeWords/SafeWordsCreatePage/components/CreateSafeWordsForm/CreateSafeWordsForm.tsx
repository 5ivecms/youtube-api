import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Button } from '@mui/material'
import { useSnackbar } from 'notistack'
import { FC, useEffect } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { object, string } from 'zod'

import { FormInput } from '../../../../../components/forms'
import { browseRoutes } from '../../../../../core/config/routes.config'
import { SafeWordsService } from '../../../../../core/services/safeWords'
import { ANY } from '../../../../../core/types'

type CreateSafeWordsFields = {
  list: string
}

const createSafeWordsSchema = object({
  list: string().nonempty('Поле не может быть пустым'),
})

const CreateSafeWordsForm: FC = () => {
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()

  const [createSafeWords, { isLoading, isError, error, isSuccess }] = SafeWordsService.useCreateMutation()
  const methods = useForm<CreateSafeWordsFields>({ mode: 'onChange', resolver: zodResolver(createSafeWordsSchema) })

  const { handleSubmit } = methods

  const onSubmitHandler: SubmitHandler<CreateSafeWordsFields> = ({ list }) => {
    const phrases = list
      .split('\n')
      .map((item) => item.trim())
      .filter((item) => item.length)
    createSafeWords({ phrases })
  }

  useEffect(() => {
    if (isSuccess) {
      enqueueSnackbar('Стоп-слова добавлены', {
        variant: 'success',
      })
      navigate(browseRoutes.safeWords.index())
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
          placeholder="Список стоп-слов"
          label="Список стоп-слов"
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

export default CreateSafeWordsForm
