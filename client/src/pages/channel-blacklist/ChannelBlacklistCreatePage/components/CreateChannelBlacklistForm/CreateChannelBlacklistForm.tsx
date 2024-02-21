import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Button } from '@mui/material'
import { FC } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { object, string } from 'zod'

import { FormInput } from '../../../../../components/forms'
import { CreateChannelBlacklistFields } from '../../../../../core/types/channel-blacklist'

type CreateChannelBlacklistFormProps = {
  loading: boolean
  onSubmit: (videoIds: string[]) => void
}

const createChannelBlacklistSchema = object({
  list: string().nonempty('Поле не может быть пустым'),
})

const CreateVideoBlacklistForm: FC<CreateChannelBlacklistFormProps> = ({ loading, onSubmit }) => {
  const methods = useForm<CreateChannelBlacklistFields>({
    mode: 'onChange',
    resolver: zodResolver(createChannelBlacklistSchema),
  })

  const { handleSubmit } = methods

  const onSubmitHandler: SubmitHandler<CreateChannelBlacklistFields> = ({ list }) => {
    const videoIds = list
      .split('\n')
      .map((item) => item.trim())
      .filter((item) => item.length)
    onSubmit(videoIds)
  }

  return (
    <FormProvider {...methods}>
      <Box autoComplete="off" component="form" onSubmit={handleSubmit(onSubmitHandler)} noValidate>
        <FormInput
          variant="outlined"
          placeholder="Список id каналов youtube"
          label="Список id каналов youtube"
          name="list"
          type="text"
          rows={5}
          multiline
          disabled={loading}
        />
        <Button disabled={loading} type="submit" variant="contained">
          Добавить
        </Button>
      </Box>
    </FormProvider>
  )
}

export default CreateVideoBlacklistForm
