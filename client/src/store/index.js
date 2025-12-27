import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import requestReducer from './requestSlice';
import equipmentReducer from './equipmentSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    requests: requestReducer,
    equipment: equipmentReducer,
  },
});
