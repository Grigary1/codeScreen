
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const backendUrl = import.meta.env.VITE_BACKEND_URL;
const token = localStorage.getItem('token');


export const myRooms = createAsyncThunk(
  'interviewer/myRooms',
  async ({ search }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/interviewer/my-rooms?search=${search}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const createRoom = createAsyncThunk(
  'interviewer/createRoom',
  async ({ name, language, isPrivate }, { rejectWithValue }) => {
    try {
      console.log('Token : ', token);
      const response = await axios.post(
        `${backendUrl}/api/interviewer/create-room`,
        { name, language, isPrivate },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const initialState = {
  rooms: [],            
  createdRoom: null,   
  loading: false,       
  error: null,          
  success: false,      
};

const interviewerSlice = createSlice({
  name: 'interviewer',
  initialState,
  reducers: {
    clearStatus(state) {
      state.error = null;
      state.success = false;
      state.createdRoom = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // createRoom
      .addCase(createRoom.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createRoom.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.createdRoom = action.payload;
        state.rooms.push(action.payload);
      })
      .addCase(createRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // myRooms
      .addCase(myRooms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(myRooms.fulfilled, (state, action) => {
        state.loading = false;
        state.rooms = action.payload;
      })
      .addCase(myRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearStatus } = interviewerSlice.actions;
export default interviewerSlice.reducer;