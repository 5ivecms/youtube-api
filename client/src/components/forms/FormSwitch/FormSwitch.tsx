import { FormControl, FormControlLabel, FormHelperText, Switch, SwitchProps } from '@mui/material'
import { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

type FormSwitchProps = SwitchProps & {
  label: string
  name: string
}

const FormSwitch: FC<FormSwitchProps> = ({ name, label, ...rest }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  return (
    <Controller
      control={control}
      defaultValue=""
      name={name}
      render={({ field }) => (
        <FormControl sx={{ mb: 2 }} fullWidth>
          <FormControlLabel control={<Switch {...field} {...rest} />} label={label} />
          {Object.keys(errors).includes(name) && (
            <FormHelperText error={!!errors[name]}>
              <>{errors[name]?.message}</>
            </FormHelperText>
          )}
        </FormControl>
      )}
    />
  )
}

export default FormSwitch
