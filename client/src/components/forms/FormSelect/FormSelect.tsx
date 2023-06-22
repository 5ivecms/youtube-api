import { FormControl, FormHelperText, MenuItem, TextField, TextFieldProps } from '@mui/material'
import { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

type FormSelectProps = TextFieldProps & {
  name: string
  label: string
  options: {
    label: string
    value: string
  }[]
}

const FormSelect: FC<FormSelectProps> = ({ name, options, label, defaultValue, ...rest }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  const getHelperText = () => {
    if (errors[name]) {
      return errors[name]?.message || 'Ошибка'
    }
    return ''
  }

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue ?? ''}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <FormControl sx={{ mb: 2 }} fullWidth>
          <TextField {...rest} error={!!error} label={label} value={value} onChange={onChange} select>
            {options.map(({ label: optionLabel, value: optionValue }) => (
              <MenuItem key={optionValue} value={optionValue}>
                {optionLabel}
              </MenuItem>
            ))}
          </TextField>
          <FormHelperText error={!!errors[name]}>
            <>{getHelperText()}</>
          </FormHelperText>
        </FormControl>
      )}
    />
  )
}

export default FormSelect
