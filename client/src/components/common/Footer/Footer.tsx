import { Box, Container, Typography } from '@mui/material'

import { container, copyright, footer } from './Footer.styles'

const Footer = () => (
  <Box sx={footer}>
    <Container maxWidth="xl" sx={container}>
      <Typography sx={copyright}>YoutubeAPI</Typography>
      <Typography sx={copyright}>© 5ivelab.ru, {new Date().getFullYear()}</Typography>
    </Container>
  </Box>
)

export default Footer
