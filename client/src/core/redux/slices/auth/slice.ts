/* eslint-disable no-param-reassign */
import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

import type { User } from '../../../models/user'
import type { AuthSliceState } from './types'

const initialState: AuthSliceState = {
  user: null,
}

const authSlice = createSlice({
  initialState,
  name: 'auth',
  reducers: {
    logOut: (state) => {
      state.user = null
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
    },
  },
})

export const { logOut, setUser } = authSlice.actions

export default authSlice.reducer
