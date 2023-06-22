import { AppBar, Box, Button, Container, Toolbar, Typography } from '@mui/material'
import { Link } from 'react-router-dom'

import { browseRoutes } from '../../../core/config/routes.config'
import { AuthService } from '../../../core/services'
import { headerMenu } from './menu'
import { appBar, headerRight, linkMenu, linksContainer, logoText, toolbar } from './styles'

const Header = () => {
  const [logout] = AuthService.useLogoutMutation()

  const handleLogout = () => {
    logout()
  }

  return (
    <AppBar sx={appBar} position="static">
      <Container maxWidth="xl">
        <Toolbar sx={toolbar} disableGutters>
          <Typography component={Link} sx={logoText} to={browseRoutes.base.home()} variant="h6" noWrap>
            YoutubeAPI
          </Typography>

          <Box sx={linksContainer}>
            {headerMenu.map((item) => (
              <Button key={item.url} component={Link} sx={linkMenu} to={item.url}>
                {item.title}
              </Button>
            ))}
          </Box>
          <Box sx={headerRight}>
            <Button component={Link} sx={linkMenu} to={browseRoutes.user.profile()}>
              Профиль
            </Button>
            <Button color="inherit" onClick={handleLogout}>
              Выйти
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default Header
