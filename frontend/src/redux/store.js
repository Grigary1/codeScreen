// // redux/store.js
// import { configureStore } from '@reduxjs/toolkit';
// import authReducer from './Auth.js'; 
// import thunk from 'redux-thunk';
// const store = configureStore({
//   reducer: {
//     auth: authReducer, 
//   },
//   middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
// });

// export default store;


// redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './Auth.js';

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  // No need to add thunk manually; it's already included by default
});

export default store;
