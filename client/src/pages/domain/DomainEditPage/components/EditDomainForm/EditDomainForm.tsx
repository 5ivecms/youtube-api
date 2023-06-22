import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Button } from '@mui/material'
import { useSnackbar } from 'notistack'
import { FC, useEffect } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { object, string } from 'zod'

import { FormInput } from '../../../../../components/forms'
import { browseRoutes } from '../../../../../core/config/routes.config'
import { DomainService } from '../../../../../core/services/domain'
import { ANY } from '../../../../../core/types'
import { DomainModel } from '../../../../../core/types/domain'

type EditDomainFields = {
  domain: string
}

type EditDomainForm = {
  domain: DomainModel
}

const editDomainSchema = object({
  domain: string().nonempty('Поле не может быть пустым'),
})

const EditDomainForm: FC<EditDomainForm> = ({ domain }) => {
  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()

  const [updateUseragent, { isSuccess, isLoading, isError, error }] = DomainService.useUpdateMutation()

  const methods = useForm<EditDomainFields>({
    defaultValues: { domain: domain.domain },
    mode: 'onChange',
    resolver: zodResolver(editDomainSchema),
  })

  const { handleSubmit } = methods

  const onSubmitHandler: SubmitHandler<EditDomainFields> = (data) => {
    updateUseragent({ id: domain.id, ...data })
  }

  useEffect(() => {
    if (isSuccess) {
      enqueueSnackbar('Домен успешно сохранен', {
        variant: 'success',
      })
      navigate(browseRoutes.domain.index())
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
          placeholder="Домен"
          label="Домен"
          name="domain"
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

export default EditDomainForm
