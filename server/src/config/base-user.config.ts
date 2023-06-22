import { registerAs } from '@nestjs/config'

export type BaseUserConfig = {
  email: string
  password: string
}

export default registerAs('baseUser', () => ({
  email: process.env.BASE_USER_EMAIL,
  password: process.env.BASE_USER_PASSWORD,
}))
