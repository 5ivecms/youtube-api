import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Button } from '@mui/material'
import { useSnackbar } from 'notistack'
import { FC, useEffect } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { object, string } from 'zod'

import { FormInput } from '../../../../../components/forms'
import { browseRoutes } from '../../../../../core/config/routes.config'
import { UseragentService } from '../../../../../core/services/useragent'
import { ANY } from '../../../../../core/types'
import { UseragentModel } from '../../../../../core/types/useragent'

type EditUseragentsFields = {
  useragent: string
}

type EditUseragentFormProps = {
  useragent: UseragentModel
}

const editUseragentSchema = object({
  useragent: string().nonempty('Поле не может быть пустым'),
})

const EditUseragentForm: FC<EditUseragentFormProps> = ({ useragent }) => {
  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()

  const [updateUseragent, { isSuccess, isLoading, isError, error }] = UseragentService.useUpdateMutation()

  const methods = useForm<EditUseragentsFields>({
    defaultValues: { useragent: useragent.useragent },
    mode: 'onChange',
    resolver: zodResolver(editUseragentSchema),
  })

  const { handleSubmit } = methods

  const onSubmitHandler: SubmitHandler<EditUseragentsFields> = (data) => {
    updateUseragent({ id: useragent.id, useragent: data.useragent })
  }

  useEffect(() => {
    if (isSuccess) {
      enqueueSnackbar('Юзерагент успешно сохранен', {
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
          placeholder="Юзерагент"
          label="Юзерагент"
          name="useragent"
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

export default EditUseragentForm
