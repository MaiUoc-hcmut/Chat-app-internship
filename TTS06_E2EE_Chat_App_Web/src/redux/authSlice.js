import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import authService from "../services/authService";

const user = JSON.parse(localStorage.getItem('user'));

export const login = createAsyncThunk('auth/login', async(user, thunkAPI) => {
    try {
        const response = await authService.login(user)
        
        if (response.status !== 200) {
            return thunkAPI.rejectWithValue(response.data.message)
        }
        // console.log(response.data);
        return response.data;
    }catch (err) {

        return thunkAPI.rejectWithValue(err?.message? err.message: "Error when call api" );
    }
})

export const registerUser = createAsyncThunk('auth/register', async (user, thunkAPI) => {
    try {
        const response = await authService.register(user)
        console.log(response)
        if (response.status !== 201) {
            return thunkAPI.rejectWithValue(response.data)
        }
        
        return response.data
    } catch (error) {
        console.log("Error", error)
        return thunkAPI.rejectWithValue(error)
    }
})


const initialState = {
    user:  user? user: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: null,

}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        reset: (state) =>{
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = false;
            state.message = ""
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                console.log("login pending")
                state.isLoading = true;
            })
            .addCase(login.fulfilled, (state, action) => {
                console.log("login fulfilled")
                state.isLoading = false;
                state.isSuccess = true;
                // state.user = action.payload
            })
            .addCase(login.rejected, (state, action) => {
                console.log("login rejected")
                state.isLoading = false
                state.isError = true;
                state.message = action.payload
                state.user = null
            })
            .addCase(registerUser.pending, (state) => {
                console.log("pending")
                state.isLoading = true;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                console.log("fulfilled")
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload
            })
            .addCase(registerUser.rejected, (state, action) => {
                console.log("rejected")
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
    }
   
})
export const {reset} = authSlice.actions;
export default authSlice.reducer;