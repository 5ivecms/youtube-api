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

type CreateDomainFields = {
  domain: string
}

const createDomainSchema = object({
  domain: string().nonempty('Поле не может быть пустым'),
})

const CreateDomainForm: FC = () => {
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const [createDomain, { isLoading, isError, error, isSuccess }] = DomainService.useCreateMutation()
  const methods = useForm<CreateDomainFields>({ mode: 'onChange', resolver: zodResolver(createDomainSchema) })

  const { handleSubmit } = methods

  const onSubmitHandler: SubmitHandler<CreateDomainFields> = (data) => {
    createDomain(data)
  }

  useEffect(() => {
    if (isSuccess) {
      enqueueSnackbar('Домен добавлен', {
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
          Добавить
        </Button>
      </Box>
    </FormProvider>
  )
}

export default CreateDomainForm
