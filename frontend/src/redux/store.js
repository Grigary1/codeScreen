// redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './Auth.js'; 

const store = configureStore({
  reducer: {
    auth: authReducer, 
  },
});

export default store;
