import { configureStore } from '@reduxjs/toolkit'
import hospitalReducer from './slices/hospitalSlice'

export const store = configureStore({
  reducer: {
    hospital: hospitalReducer,
  },
})
