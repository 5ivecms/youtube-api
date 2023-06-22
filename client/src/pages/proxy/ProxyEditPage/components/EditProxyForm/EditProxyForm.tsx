import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Button, Grid } from '@mui/material'
import { useSnackbar } from 'notistack'
import { FC, useEffect } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { boolean, number, object, string } from 'zod'

import { FormInput, FormSelect, FormSwitch } from '../../../../../components/forms'
import { browseRoutes } from '../../../../../core/config/routes.config'
import { ProxyService } from '../../../../../core/services/proxy'
import { ANY } from '../../../../../core/types'
import { protocols, ProxyModel, UpdateProxyDto } from '../../../../../core/types/proxy'

type EditProxyFormProps = {
  proxy: ProxyModel
}

const editProxySchema = object({
  ip: string().nonempty('Поле не может быть пустым'),
  isActive: boolean(),
  login: string().nonempty('Поле не может быть пустым'),
  password: string().nonempty('Поле не может быть пустым'),
  port: number(),
  protocol: string().nonempty('Поле не может быть пустым'),
  comment: string(),
})

const EditProxyForm: FC<EditProxyFormProps> = ({ proxy }) => {
  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()

  const [updateProxy, { isSuccess, isLoading, isError, error }] = ProxyService.useUpdateMutation()

  const methods = useForm<Omit<UpdateProxyDto, 'id'>>({
    defaultValues: {
      ip: proxy.ip,
      isActive: proxy.isActive,
      login: proxy.login,
      password: proxy.password,
      port: proxy.port,
      protocol: proxy.protocol,
      comment: proxy.comment,
    },
    mode: 'onChange',
    resolver: zodResolver(editProxySchema),
  })

  const { handleSubmit } = methods

  const onSubmitHandler: SubmitHandler<Omit<UpdateProxyDto, 'id'>> = (data) => {
    updateProxy({ id: proxy.id, ...data, port: Number(data.port) })
  }

  useEffect(() => {
    if (isSuccess) {
      enqueueSnackbar('Прокси успешно обновлен', {
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
        <Grid spacing={2} container>
          <Grid xs={12} item>
            <FormSwitch label="Активен" name="isActive" defaultChecked={proxy.isActive} />
          </Grid>
          <Grid xs={12} item>
            <FormSelect
              name="protocol"
              variant="outlined"
              label="Протокол"
              options={protocols.map((option) => ({ label: option, value: option }))}
              defaultValue={proxy.protocol}
              fullWidth
            />
          </Grid>
          <Grid xs={6} item>
            <FormInput name="ip" variant="outlined" placeholder="IP" label="IP" type="text" disabled={isLoading} />
          </Grid>
          <Grid xs={6} item>
            <FormInput
              name="port"
              variant="outlined"
              label="Порт"
              placeholder="Порт"
              type="number"
              disabled={isLoading}
            />
          </Grid>
          <Grid xs={6} item>
            <FormInput
              name="login"
              variant="outlined"
              label="Логин"
              placeholder="Логин"
              type="text"
              disabled={isLoading}
            />
          </Grid>
          <Grid xs={6} item>
            <FormInput
              name="password"
              variant="outlined"
              label="Пароль"
              placeholder="Пароль"
              type="text"
              disabled={isLoading}
            />
          </Grid>
          <Grid xs={12} item>
            <FormInput
              name="comment"
              variant="outlined"
              label="Комментарий"
              placeholder="Комментарий"
              type="text"
              multiline
              rows={5}
              disabled={isLoading}
            />
          </Grid>
        </Grid>

        <Button disabled={isLoading} type="submit" variant="contained">
          Сохранить
        </Button>
      </Box>
    </FormProvider>
  )
}

export default EditProxyForm
