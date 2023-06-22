import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Button, Grid } from '@mui/material'
import { useSnackbar } from 'notistack'
import { FC, useEffect } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { boolean, object, string } from 'zod'

import { FormInput } from '../../../../../components/forms'
import FormSwitch from '../../../../../components/forms/FormSwitch/FormSwitch'
import { browseRoutes } from '../../../../../core/config/routes.config'
import { InvidiousService } from '../../../../../core/services/invidious'
import { ANY } from '../../../../../core/types'
import { InvidiousModel, UpdateInvidiousDto } from '../../../../../core/types/invidious'

interface EditInvidiousFormProps {
  invidious: InvidiousModel
}

const editInvidiousSchema = object({
  host: string().nonempty('Поле не может быть пустым'),
  isActive: boolean(),
  isWorkable: boolean(),
  useRandomUseragent: boolean(),
  useProxy: boolean(),
  comment: string(),
})

const EditInvidiousForm: FC<EditInvidiousFormProps> = ({ invidious }) => {
  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()

  const [invidiousUseragent, { isSuccess, isLoading, isError, error }] = InvidiousService.useUpdateMutation()

  const methods = useForm<Omit<UpdateInvidiousDto, 'id'>>({
    defaultValues: {
      host: invidious.host,
      isActive: invidious.isActive,
      isWorkable: invidious.isWorkable,
      useRandomUseragent: invidious.useRandomUseragent,
      useProxy: invidious.useProxy,
      comment: invidious.comment,
    },
    mode: 'onChange',
    resolver: zodResolver(editInvidiousSchema),
  })

  const { handleSubmit } = methods

  const onSubmitHandler: SubmitHandler<Omit<UpdateInvidiousDto, 'id'>> = (data) => {
    invidiousUseragent({ id: invidious.id, ...data })
  }

  useEffect(() => {
    if (isSuccess) {
      enqueueSnackbar('Invidious хост успешно сохранен', {
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
        <Grid spacing={2} container>
          <Grid xs={3} item>
            <FormSwitch label="Активен" name="isActive" defaultChecked={invidious.isActive} />
          </Grid>
          <Grid xs={3} item>
            <FormSwitch label="Работает" name="isWorkable" defaultChecked={invidious.isWorkable} />
          </Grid>
          <Grid xs={3} item>
            <FormSwitch
              label="Случ. юзерагент"
              name="useRandomUseragent"
              defaultChecked={invidious.useRandomUseragent}
            />
          </Grid>
          <Grid xs={3} item>
            <FormSwitch label="Прокси" name="useProxy" defaultChecked={invidious.useProxy} />
          </Grid>
        </Grid>
        <FormInput variant="outlined" placeholder="Хост" label="Хост" name="host" type="text" disabled={false} />
        <FormInput
          variant="outlined"
          placeholder="Комментарий"
          label="Комментарий"
          name="comment"
          type="text"
          multiline
          rows={3}
          disabled={false}
        />
        <Button disabled={false} type="submit" variant="contained">
          Сохранить
        </Button>
      </Box>
    </FormProvider>
  )
}

export default EditInvidiousForm
