import { Button, FormControl, FormControlLabel, Switch, TextField, Typography } from '@mui/material'
import type { FC } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'

import type { SettingsModel } from '../../../../../core/types/settings'
import { SettingsEnum } from '../../../../../core/types/settings'
import { formControl, titleSx } from './styles'

type SettingsFormProps = {
  loading: boolean
  onSubmit: (data: { settings: SettingsModel[] }) => void
  settings: SettingsModel[]
  title: string
}

const SettingsForm: FC<SettingsFormProps> = ({ settings, title = '', loading, onSubmit }) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
  } = useForm<{ settings: SettingsModel[] }>({
    defaultValues: { settings },
    mode: 'onChange',
  })
  const { fields } = useFieldArray({ control, name: 'settings' })

  return (
    <>
      {title.length > 0 && (
        <Typography sx={titleSx} variant="h6">
          {title}
        </Typography>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        {fields.map((field, index) => {
          return (
            <FormControl key={field.id} sx={formControl} fullWidth>
              {settings[index].type === SettingsEnum.BOOLEAN && (
                <FormControlLabel
                  control={
                    <Switch
                      {...register(`settings.${index}.value`)}
                      defaultChecked={Boolean(settings[index].value)}
                      disabled={loading}
                    />
                  }
                  label={settings[index].label}
                />
              )}

              {settings[index].type === SettingsEnum.INTEGER && (
                <TextField
                  {...register(`settings.${index}.value`, { required: 'Поле не может быть пустым' })}
                  InputLabelProps={{ shrink: true }}
                  disabled={loading}
                  error={!!errors.settings && !!errors.settings[index]}
                  helperText={
                    !!errors.settings && !!errors.settings[index] && String(errors.settings[index]?.value?.message)
                  }
                  label={settings[index].label}
                  placeholder={settings[index].label}
                  type="number"
                />
              )}

              {settings[index].type === SettingsEnum.STRING && (
                <TextField
                  {...register(`settings.${index}.value`, { required: 'Поле не может быть пустым' })}
                  InputLabelProps={{ shrink: true }}
                  disabled={loading}
                  error={!!errors.settings && !!errors.settings[index]}
                  helperText={
                    !!errors.settings && !!errors.settings[index] && String(errors.settings[index]?.value?.message)
                  }
                  label={settings[index].label}
                  placeholder={settings[index].label}
                  type="string"
                />
              )}

              {settings[index].type === SettingsEnum.TEXT && (
                <TextField
                  {...register(`settings.${index}.value`)}
                  InputLabelProps={{ shrink: true }}
                  disabled={loading}
                  error={!!errors.settings && !!errors.settings[index]}
                  helperText={
                    !!errors.settings && !!errors.settings[index] && String(errors.settings[index]?.value?.message)
                  }
                  label={settings[index].label}
                  placeholder={settings[index].label}
                  rows={5}
                  type="string"
                  multiline
                />
              )}
            </FormControl>
          )
        })}
        <Button disabled={loading} type="submit" variant="contained">
          Сохранить
        </Button>
      </form>
    </>
  )
}

export default SettingsForm
