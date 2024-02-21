import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Button } from '@mui/material'
import { useSnackbar } from 'notistack'
import { FC, useEffect } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { object, string } from 'zod'

import { FormInput } from '../../../../../components/forms'
import { browseRoutes } from '../../../../../core/config/routes.config'
import { ChannelBlacklistService } from '../../../../../core/services/channel-blacklist'
import { ANY } from '../../../../../core/types'
import { ChannelBlacklistModel } from '../../../../../core/types/channel-blacklist'

type EditChannelBlacklistFields = {
  channelId: string
}

type EditChannelFormProps = {
  channelBlacklist: ChannelBlacklistModel
}

const editChannelBlacklistSchema = object({
  channelId: string().nonempty('Поле не может быть пустым'),
})

const ChannelBlacklistForm: FC<EditChannelFormProps> = ({ channelBlacklist }) => {
  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()

  const [updateChannelBlacklist, { isSuccess, isLoading, isError, error }] = ChannelBlacklistService.useUpdateMutation()

  const methods = useForm<EditChannelBlacklistFields>({
    defaultValues: { channelId: channelBlacklist.channelId },
    mode: 'onChange',
    resolver: zodResolver(editChannelBlacklistSchema),
  })

  const { handleSubmit } = methods

  const onSubmitHandler: SubmitHandler<EditChannelBlacklistFields> = (data) => {
    updateChannelBlacklist({ id: channelBlacklist.id, data })
  }

  useEffect(() => {
    if (isSuccess) {
      enqueueSnackbar('ChannelId успешно сохранен', { variant: 'success' })
      navigate(browseRoutes.channelBlacklist.index())
      return
    }

    if (isError) {
      enqueueSnackbar((error as ANY).data.message, { variant: 'error' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading])

  return (
    <FormProvider {...methods}>
      <Box autoComplete="off" component="form" onSubmit={handleSubmit(onSubmitHandler)} noValidate>
        <FormInput
          variant="outlined"
          placeholder="ChannelId"
          label="ChannelId"
          name="channelId"
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

export default ChannelBlacklistForm
