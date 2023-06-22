import { FormControl, FormHelperText, TextField, TextFieldProps, Typography } from '@mui/material'
import type { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

type FormInputProps = TextFieldProps & {
  label: string
  name: string
}

const FormInput: FC<FormInputProps> = ({ name, label, ...rest }) => {
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
          <Typography variant="body2">{label}</Typography>
          <TextField {...field} error={!!errors[name]} fullWidth {...rest} />
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

export default FormInput
