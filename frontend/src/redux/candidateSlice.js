import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const backendUrl = import.meta.env.VITE_BACKEND_URL;
const token = localStorage.getItem('token');

export const searchResult = createAsyncThunk(
  'rooms/searchResult',
  async (searchQuery, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${backendUrl}/api/search-room`, {
        params: { s: searchQuery },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.results;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Search failed'
      );
    }
  }
);

const candidateSlice = createSlice({
  name: 'rooms',
  initialState: {
    results: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(searchResult.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchResult.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload;
      })
      .addCase(searchResult.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default candidateSlice.reducer;
