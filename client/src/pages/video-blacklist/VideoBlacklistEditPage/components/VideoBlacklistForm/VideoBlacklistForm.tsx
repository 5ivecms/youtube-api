import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Button } from '@mui/material'
import { useSnackbar } from 'notistack'
import { FC, useEffect } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { object, string } from 'zod'

import { FormInput } from '../../../../../components/forms'
import { browseRoutes } from '../../../../../core/config/routes.config'
import { VideoBlacklistService } from '../../../../../core/services/video-blacklist'
import { ANY } from '../../../../../core/types'
import { VideoBlacklistModel } from '../../../../../core/types/video-blacklist'

type EditVideoBlacklistFields = {
  videoId: string
}

type EditSafeWordFormProps = {
  videoBlacklist: VideoBlacklistModel
}

const editVideoBlacklistSchema = object({
  videoId: string().nonempty('Поле не может быть пустым'),
})

const VideoBlacklistForm: FC<EditSafeWordFormProps> = ({ videoBlacklist }) => {
  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()

  const [updateVideoBlacklist, { isSuccess, isLoading, isError, error }] = VideoBlacklistService.useUpdateMutation()

  const methods = useForm<EditVideoBlacklistFields>({
    defaultValues: { videoId: videoBlacklist.videoId },
    mode: 'onChange',
    resolver: zodResolver(editVideoBlacklistSchema),
  })

  const { handleSubmit } = methods

  const onSubmitHandler: SubmitHandler<EditVideoBlacklistFields> = (data) => {
    updateVideoBlacklist({ id: videoBlacklist.id, data })
  }

  useEffect(() => {
    if (isSuccess) {
      enqueueSnackbar('VideoId успешно сохранено', {
        variant: 'success',
      })
      navigate(browseRoutes.videoBlacklist.index())
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
          placeholder="VideoId"
          label="VideoId"
          name="videoId"
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

export default VideoBlacklistForm
