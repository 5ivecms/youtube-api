import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Button } from '@mui/material'
import { useSnackbar } from 'notistack'
import { FC, useEffect } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { object, string } from 'zod'

import { FormInput, FormSelect } from '../../../../../components/forms'
import { browseRoutes } from '../../../../../core/config/routes.config'
import { ProxyService } from '../../../../../core/services/proxy'
import { ANY } from '../../../../../core/types'
import { CreateProxyDto, protocols } from '../../../../../core/types/proxy'

export type CreateProxyFormFields = {
  list: string
  protocol: string
}

const createProxySchema = object({
  protocol: string().nonempty('Поле не может быть пустым'),
  list: string().nonempty('Поле не может быть пустым'),
})

const CreateProxiesForm: FC = () => {
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const [createProxies, { isLoading, isError, error, isSuccess }] = ProxyService.useCreateMutation()
  const methods = useForm<CreateProxyFormFields>({ mode: 'onChange', resolver: zodResolver(createProxySchema) })

  const { handleSubmit } = methods

  const onSubmitHandler: SubmitHandler<CreateProxyFormFields> = ({ list, protocol }) => {
    const proxies: CreateProxyDto[] = list
      .split('\n')
      .map((item) => item.trim())
      .filter((item) => item.length > 0)
      .map((item) => {
        const [mainParts, comment] = item.split('|')
        const [ipPort, loginPassword] = mainParts.split('@')
        const [ip, port] = ipPort.split(':')
        const [login, password] = loginPassword.split(':')
        return { ip, login, comment, password, port: Number(port), protocol }
      })
    createProxies({ proxies })
  }

  useEffect(() => {
    if (isSuccess) {
      enqueueSnackbar('Прокси добавлены', {
        variant: 'success',
      })
      navigate(browseRoutes.proxy.index())
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
        <FormSelect
          name="protocol"
          variant="outlined"
          label="Протокол"
          options={protocols.map((option) => ({ label: option, value: option }))}
          fullWidth
        />
        <FormInput
          variant="outlined"
          label="Список прокси"
          name="list"
          type="text"
          placeholder="ip:port@login:password|Комментарий"
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

export default CreateProxiesForm
