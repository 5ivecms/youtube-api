import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Button } from '@mui/material'
import { useSnackbar } from 'notistack'
import { FC, useEffect } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { object, string } from 'zod'

import { FormInput } from '../../../../../components/forms'
import { browseRoutes } from '../../../../../core/config/routes.config'
import { InvidiousService } from '../../../../../core/services/invidious'
import { ANY } from '../../../../../core/types'
import { CreateInvidiousDto } from '../../../../../core/types/invidious'

const createInvidiousSchema = object({
  host: string().nonempty('Поле не может быть пустым'),
  comment: string(),
})

const CreateInvidiousForm: FC = () => {
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const [createInvidious, { isLoading, isError, error, isSuccess }] = InvidiousService.useCreateMutation()
  const methods = useForm<CreateInvidiousDto>({ mode: 'onChange', resolver: zodResolver(createInvidiousSchema) })

  const { handleSubmit } = methods

  const onSubmitHandler: SubmitHandler<CreateInvidiousDto> = (data) => {
    createInvidious(data)
  }

  useEffect(() => {
    if (isSuccess) {
      enqueueSnackbar('Invidious хост добавлен', {
        variant: 'success',
      })
      navigate(browseRoutes.invidious.index())
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
        <FormInput variant="outlined" placeholder="Хост" label="Хост" name="host" type="text" disabled={isLoading} />
        <FormInput
          variant="outlined"
          placeholder="Комментарий"
          label="Комментарий"
          name="comment"
          type="text"
          multiline
          rows={3}
          disabled={isLoading}
        />
        <Button disabled={isLoading} type="submit" variant="contained">
          Добавить
        </Button>
      </Box>
    </FormProvider>
  )
}

export default CreateInvidiousForm
