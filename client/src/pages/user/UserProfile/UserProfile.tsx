import { Grid, Paper, Typography } from '@mui/material'

import { PageHeader } from '../../../components/ui'
import { selectCurrentUser } from '../../../core/redux/slices/auth/selectors'
import { useAppSelector } from '../../../core/redux/store'
import { AdminLayout } from '../../../layouts'
import { ChangePasswordForm, Profile } from './components'
import { formTitle, paper } from './UserProfile.styles'

const UserProfile = () => {
  const user = useAppSelector(selectCurrentUser)
  return (
    <AdminLayout>
      <PageHeader title="Профиль" />
      <Grid spacing={2} container>
        <Grid xs={4} item>
          <Paper sx={paper}>
            {user && <Profile user={user} />}
            <Typography variant="h6" sx={formTitle}>
              Сменить пароль
            </Typography>
            <ChangePasswordForm />
          </Paper>
        </Grid>
      </Grid>
    </AdminLayout>
  )
}

export default UserProfile
