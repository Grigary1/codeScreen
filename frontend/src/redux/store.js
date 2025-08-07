import { configureStore } from '@reduxjs/toolkit';
import authReducer from './Auth.js';
import interviewerReducer from './interviewerSlice.js';
import candidateReducer from './candidateSlice.js'; 
const store = configureStore({
  reducer: {
    auth: authReducer,
    interviewer: interviewerReducer,
    candidate: candidateReducer,
  },
});

export default store;
