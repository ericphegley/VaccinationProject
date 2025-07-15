import { configureStore } from '@reduxjs/toolkit';
import userReducer from './user/userSlice';
import hospitalReducer from './hospital/hospitalSlice';
import vaccineReducer from './vaccine/vaccineSlice';
import appointmentReducer from './appointment/appointmentSlice';
const store = configureStore({
  reducer: {
    user: userReducer,
    hospital: hospitalReducer,
    vaccine: vaccineReducer,
    appointment: appointmentReducer
  },
  // optional: to add logging or dev tools
  middleware: (getDefaultMiddleware) => getDefaultMiddleware()
});

export default store;
