import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { resolveHospitalConfig } from '../../utils/hospitalConfig'

export const fetchHospitalConfig = createAsyncThunk(
  'hospital/fetchConfig',
  async (slug, { rejectWithValue }) => {
    const config = await resolveHospitalConfig(slug)
    if (!config) return rejectWithValue(`No hospital configured for "${slug}"`)
    return config
  }
)

const initialState = {
  slug: null,
  config: null,
  status: 'idle', // idle | loading | succeeded | failed
  error: null,
}

const hospitalSlice = createSlice({
  name: 'hospital',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHospitalConfig.pending, (state, action) => {
        state.status = 'loading'
        state.slug = action.meta.arg
        state.error = null
      })
      .addCase(fetchHospitalConfig.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.config = action.payload
      })
      .addCase(fetchHospitalConfig.rejected, (state, action) => {
        state.status = 'failed'
        state.config = null
        state.error = action.payload ?? action.error.message
      })
  },
})

export default hospitalSlice.reducer
