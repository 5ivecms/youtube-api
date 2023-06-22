import { Autocomplete, CircularProgress, TextField } from '@mui/material'
import type { ReactElement, SyntheticEvent } from 'react'
import { useCallback, useEffect, useState } from 'react'

import { useDebounce } from '../../../../../core/hooks'

interface AsyncAutocompleteProps {
  loadOptions: (term: string) => Promise<{ label: string; value: string }[]>
  onChange: (value: string) => void
  placeholder: string
}

const AsyncAutocomplete = (props: AsyncAutocompleteProps): ReactElement => {
  const { loadOptions, placeholder, onChange } = props
  const [open, setOpen] = useState(false)
  const [options, setOptions] = useState<readonly { label: string; value: string }[]>([])
  const [searchText, setSearchText] = useState<string>('')
  const debouncedText = useDebounce(searchText, 500)

  const loading = open && options.length === 0

  const handleInputChange = (_: SyntheticEvent<Element, Event>, value: string): void => {
    setSearchText(value)
  }

  const handleChange = (e: SyntheticEvent<Element, Event>, value: { label: string; value: string } | null): void => {
    if (value === null) {
      onChange('')
      return
    }

    if (value) {
      onChange(value.value)
    }
  }

  const fetch = useCallback(
    async (query: string): Promise<void> => {
      const result = await loadOptions(query)
      setOptions(result)
    },
    [loadOptions]
  )

  useEffect(() => {
    if (!open) {
      return
    }

    fetch(debouncedText)
  }, [fetch, debouncedText, open])

  useEffect(() => {
    if (!open) {
      setOptions([])
    }
    fetch('')
  }, [open, fetch])

  return (
    <Autocomplete
      getOptionLabel={(option) => option.label}
      isOptionEqualToValue={(option, value) => option.value === value.value}
      loading={loading}
      onChange={(e, value) => handleChange(e, value)}
      onClose={() => setOpen(false)}
      onInputChange={handleInputChange}
      onOpen={() => setOpen(true)}
      open={open}
      options={options}
      renderInput={(params) => (
        <TextField
          {...params}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20} /> : undefined}
                {params.InputProps.endAdornment}
              </>
            ),
            placeholder,
          }}
          label={placeholder}
        />
      )}
      size="small"
    />
  )
}

export default AsyncAutocomplete
