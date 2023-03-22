import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import userReducer from './userSlice'
import chatReducer from './chatSlice'
export const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        chat: chatReducer,
    },
});
