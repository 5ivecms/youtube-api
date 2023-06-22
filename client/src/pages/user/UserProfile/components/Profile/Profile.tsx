import { Box, Typography } from '@mui/material'
import { FC } from 'react'

import { User } from '../../../../../core/models/user'
import { field, fieldName } from './Profile.styles'

type ProfileProps = {
  user: User
}

const Profile: FC<ProfileProps> = ({ user }) => {
  return (
    <Box>
      <Typography sx={field}>
        <Typography sx={fieldName} component="span">
          ID:{' '}
        </Typography>
        {user?.id}
      </Typography>
      <Typography sx={field}>
        <Typography sx={fieldName} component="span">
          Email:{' '}
        </Typography>
        {user?.email}
      </Typography>
    </Box>
  )
}

export default Profile
