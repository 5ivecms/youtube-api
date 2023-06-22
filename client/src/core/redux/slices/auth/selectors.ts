import type { User } from '../../../models/user'
import type { RootState } from '../../store'

export const selectCurrentUser = (state: RootState): User | null => state.auth.user
