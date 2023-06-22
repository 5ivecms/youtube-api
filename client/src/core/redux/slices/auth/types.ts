import type { User } from '../../../models/user'

export type AuthSliceState = {
  user: User | null
}
