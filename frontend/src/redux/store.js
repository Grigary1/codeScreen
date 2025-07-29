import { configureStore } from '@reduxjs/toolkit';
import authReducer from './Auth.js';
import interviewerReducer from './interviewerSlice.js';

const store = configureStore({
  reducer: {
    auth: authReducer,
    interviewer: interviewerReducer,
  },
});

export default store;