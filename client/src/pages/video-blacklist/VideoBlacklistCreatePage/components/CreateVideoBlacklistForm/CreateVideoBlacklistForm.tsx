import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Button } from '@mui/material'
import { FC } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { object, string } from 'zod'

import { FormInput } from '../../../../../components/forms'
import { CreateVideoBlacklistFields } from '../../../../../core/types/video-blacklist'

type CreateVideoBlacklistFormProps = {
  loading: boolean
  onSubmit: (videoIds: string[]) => void
}

const createVideoBlacklistSchema = object({
  list: string().nonempty('Поле не может быть пустым'),
})

const CreateVideoBlacklistForm: FC<CreateVideoBlacklistFormProps> = ({ loading, onSubmit }) => {
  const methods = useForm<CreateVideoBlacklistFields>({
    mode: 'onChange',
    resolver: zodResolver(createVideoBlacklistSchema),
  })

  const { handleSubmit } = methods

  const onSubmitHandler: SubmitHandler<CreateVideoBlacklistFields> = ({ list }) => {
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
          placeholder="Список id видео youtube"
          label="Список id видео youtube"
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
