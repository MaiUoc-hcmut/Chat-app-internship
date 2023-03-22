import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import userService from './../services/userService';


const baseURL = 'https://chatapp-server-dev.herokuapp.com/api/v1'

export const getUser = createAsyncThunk('users/getUser', async (thunkAPI) => {
    try {
        const data = await userService.getUser();
        console.log(data);
        if (!data?.data?.user) {
            return thunkAPI.rejectWithValue(data?.response?.data.message);
        }
        
        return data;
    } catch (err) {
        console.log(err);
        return thunkAPI.rejectWithValue(err?.message ? err.message : 'Error when call api');
    }
});

export const updateProfile = createAsyncThunk('users/me', async (user, thunkAPI) => {
    try {
        const accessToken = JSON.parse(localStorage.getItem('accessToken'));
        const configHeaders = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        }
        const data = await axios.patch(`${baseURL}/users/me`, user, configHeaders)
        console.log('updateProfile', data.data)
        if(data.status !== 200) {
            return thunkAPI.rejectWithValue(data)
        }
        localStorage.setItem('user', JSON.stringify(data.data.data.user)) 
        return data.data;
    } catch (error) {
        return error.message
    }
})

export const sendVerifyEmail = createAsyncThunk('users/forgot-password', async (email, thunkAPI) => {
    try {
        const data = await axios.post(`${baseURL}/users/forgot-password`, email);
        if(data.status !== 200) {
            return thunkAPI.rejectWithValue(data)
        }
        localStorage.setItem('reset-token', JSON.stringify(data.data.resetToken));
        console.log(data);
        return data.data
    } catch (error) {
        return error.message;
    }
})

export const resetPassword = createAsyncThunk('users/reset-password', async (data, thunkAPI) => {
    try {
        console.log('here')
        const token = JSON.parse(localStorage.getItem('reset-token'));
        
        const response = await axios.patch(`${baseURL}/users/reset-password/${token}`, data);
        if(response.status !== 200) {
            return thunkAPI.rejectWithValue(response)
        }
        console.log(response)
        return response.data
    } catch (error) {
        return error;
    }
})


const initialState = {
    user: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: null,
};

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = false;
            state.message = '';
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getUser.fulfilled, (state, action) => {
                console.log('fulfilled');
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload.data.user;
            })
            .addCase(getUser.rejected, (state, action) => {
                console.log('rejected');
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.user = null;
            })
            .addCase(updateProfile.pending, (state) => {
                console.log('pending')
                state.isLoading = true;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                console.log("fullfiled")
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload.data.user;
            })
            .addCase(updateProfile.rejected, (state, action) => {
                console.log("rejected");
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.user = null;
            })
            .addCase(sendVerifyEmail.pending, (state) => {
                console.log('pending')
                state.isLoading = true;
            })
            .addCase(sendVerifyEmail.fulfilled, (state, action) => {
                console.log("fullfiled")
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(sendVerifyEmail.rejected, (state, action) => {
                console.log("rejected");
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.user = null;
            })
            .addCase(resetPassword.pending, (state) => {
                console.log('pending')
                state.isLoading = true;
            })
            .addCase(resetPassword.fulfilled, (state, action) => {
                console.log("fullfiled")
                state.isLoading = false;
                state.isSuccess = true;
                console.log(action.payload)
                //state.user = action.payload.data.user;
            })
            .addCase(resetPassword.rejected, (state, action) => {
                console.log("rejected");
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.user = null;
            });
    },
});

export const { reset } = userSlice.actions;
export default userSlice.reducer;
