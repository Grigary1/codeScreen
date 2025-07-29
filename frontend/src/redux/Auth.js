import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


const backendUrl = import.meta.env.VITE_BACKEND_URL;


// Thunk to send OTP
export const sendOtp = createAsyncThunk(
  'auth/sendOtp',
  async (formData, { rejectWithValue }) => {
    try {
    
      const res = await axios.post(`${backendUrl}/api/send-otp`, formData);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send OTP');
    }
  }
);

// Thunk to verify OTP
export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${backendUrl}/api/verify-otp`, { email, otp });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Invalid OTP');
    }
  }
);

// Thunk to sign up a new user
export const signupUser = createAsyncThunk(
  'auth/signupUser',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${backendUrl}/api/signup`, formData);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Signup failed');
    }
  }
);

// Thunk to log in a user
export const handleLogin = createAsyncThunk(

  'auth/login',
  async ({email,password}, { rejectWithValue }) => {
    try {
      console.log("Calling handlelogin" ,email)
      const res = await axios.post(`${backendUrl}/api/login`, {email,password});

      console.log("Redux : ",res.data);
      return res.data;
    } catch (error) {

      console.log("Error ",error.message);
      return rejectWithValue(error.response?.data?.message || 'Failed to login');
    }
  }
);


const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    message: null, 
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      state.message = null;
    },
    
    clearAuthMessages(state) {
      state.error = null;
      state.message = null;
    }
  },
  extraReducers: (builder) => {
    builder

      .addCase(sendOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })

      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })

      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })

      .addCase(handleLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.message = action.payload.message;
      })

      .addMatcher(
        (action) =>
          [sendOtp.pending, verifyOtp.pending, signupUser.pending, handleLogin.pending].includes(action.type),
        (state) => {
          state.loading = true;
          state.error = null;
          state.message = null;
        }
      )
      .addMatcher(
        (action) =>
          [sendOtp.rejected, verifyOtp.rejected, signupUser.rejected, handleLogin.rejected].includes(action.type),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  }

});

export const { logout, clearAuthMessages } = authSlice.actions;
export default authSlice.reducer;