import { registerAs } from '@nestjs/config'

export default registerAs('database', () => ({
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT || 5432,
  user: process.env.POSTGRES_USER,
  db: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
}))
