// redux/Auth.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const backendUrl=import.meta.env.BACKENDURL;

export const verifyOtp=createAsyncThunk(
    'auth/verifyOtp',
    async(email,otp,{rejectWithValue})=>{
        try {
            const res=await axios.post(`${backendUrl}/api/verify-otp`,
                email,
                otp
            );
            return res.data;
        } catch (error) {
            return rejectWithValue(err.response?.data?.message || 'Failed to send OTP');
        }
    }
)

export const sendOtp = createAsyncThunk(
  'auth/sendOtp',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${backendUrl}/api/send-otp`, formData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to send OTP');
    }
  }
);


export const signupUser = createAsyncThunk(
  'auth/signupUser',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${backendUrl}/api/signup`, formData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Signup failed');
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
    otpMessage: null,
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      //sign-up
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //send-otp
      .addCase(sendOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.otpMessage = null;
      })
      .addCase(sendOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.otpMessage = action.payload.message;
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});


export const { logout } = authSlice.actions;
export default authSlice.reducer;
