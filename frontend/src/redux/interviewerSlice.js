import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const backendUrl = import.meta.env.VITE_BACKEND_URL;
const token = localStorage.getItem('token');

const initialState = {
  rooms: [],            // array of room objects
  createdRoom: null,    // single room object when created
  loading: false,       // operation loading flag
  error: null,          // error message
  success: false,       // success flag for creation
};

// Fetch interviewer's rooms (unwraps data.data -> array of rooms)
export const myRooms = createAsyncThunk(
  'interviewer/myRooms',
  async ({ search }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/interviewer/my-rooms?search=${search}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Assuming response.data = { success, data: [ rooms ] }
      return response.data.data;  // unwrap so payload is array of rooms
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Create a new room (unwraps data.data -> new room object)
export const createRoom = createAsyncThunk(
  'interviewer/createRoom',
  async ({ name, language, isPrivate }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/interviewer/create-room`,
        { name, language, isPrivate },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Assuming response.data = { success, message, data: newRoom }
      return response.data;  // unwrap so payload is newRoom
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

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
        state.createdRoom = action.payload;    // raw new room object
        state.rooms.push(action.payload);      // append to rooms array
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
        state.rooms = action.payload;          // array of rooms
      })
      .addCase(myRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearStatus } = interviewerSlice.actions;
export default interviewerSlice.reducer;
