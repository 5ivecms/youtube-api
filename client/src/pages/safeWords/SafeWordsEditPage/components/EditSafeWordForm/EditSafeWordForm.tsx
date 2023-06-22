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
import { SafeWordModel } from '../../../../../core/types/safeWords'

type EditSafeWordFields = {
  phrase: string
}

type EditSafeWordFormProps = {
  safeWord: SafeWordModel
}

const editUseragentSchema = object({
  phrase: string().nonempty('Поле не может быть пустым'),
})

const EditSafeWordForm: FC<EditSafeWordFormProps> = ({ safeWord }) => {
  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()

  const [updateUseragent, { isSuccess, isLoading, isError, error }] = SafeWordsService.useUpdateMutation()

  const methods = useForm<EditSafeWordFields>({
    defaultValues: { phrase: safeWord.phrase },
    mode: 'onChange',
    resolver: zodResolver(editUseragentSchema),
  })

  const { handleSubmit } = methods

  const onSubmitHandler: SubmitHandler<EditSafeWordFields> = (data) => {
    updateUseragent({ id: safeWord.id, phrase: data.phrase })
  }

  useEffect(() => {
    if (isSuccess) {
      enqueueSnackbar('Стоп-слово успешно сохранен', {
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
          placeholder="Стоп-слов"
          label="Стоп-слов"
          name="phrase"
          type="text"
          disabled={isLoading}
        />
        <Button disabled={isLoading} type="submit" variant="contained">
          Сохранить
        </Button>
      </Box>
    </FormProvider>
  )
}

export default EditSafeWordForm
