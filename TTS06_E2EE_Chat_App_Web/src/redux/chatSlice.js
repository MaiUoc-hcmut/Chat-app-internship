import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import chatService from '../services/chatService';

const initialState = {
    selectedChat: null,
    roomMessage: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: null,
    socket: null,
    countNewMessages: {},
    lastMessage: null,
    newDirectChat: null,
};

export const loadRoomMessage = createAsyncThunk('chat/loadRoomMessage', async (roomId, thunkAPI) => {
    try {
        const response = await chatService.getRoomMessages(roomId);
        if (response.status !== 200) {
            return thunkAPI.rejectWithValue(response?.data?.message);
        }
        return response.data;
    } catch (err) {
        console.log(err);
        return thunkAPI.rejectWithValue(err?.message ? err.message : 'Error when call api');
    }
});

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = false;
            state.message = '';
            state.roomMessage = [];
            // state.selectedChat = null;
            state.countNewMessages = {};
            state.newDirectChat = null;
        },
        selectChat: (state, action) => {
            state.selectedChat = action.payload;
        },
        establishSocket: (state, action) => {
            state.socket = action.payload;
        },
        loadMessageRoom: (state, action) => {
            state.roomMessage = action.payload;
        },
        addNotifications: (state, action) => {
            if (state.countNewMessages?.[action.payload]) {
                state.countNewMessages[action.payload] += 1;
            } else {
                state.countNewMessages[action.payload] = 1;
            }
        },

        removeNotifications: (state, action) => {
            if (state.countNewMessages?.[action.payload]) delete state.countNewMessages[action.payload];
        },

        lastestMessage: (state, action) => {
            state.lastMessage = action.payload;
        },

        addChat: (state, action) => {
            state.newDirectChat = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadRoomMessage.pending, (state) => {
                console.log('loadRoomMessage pending');
                state.isLoading = true;
            })
            .addCase(loadRoomMessage.fulfilled, (state, action) => {
                console.log('loadRoomMessage fulfilled');
                state.isLoading = false;
                state.isSuccess = true;
                state.roomMessage = action.payload.data?.messgages;
            })
            .addCase(loadRoomMessage.rejected, (state, action) => {
                console.log('loadRoomMessage rejected');
                state.isLoading = false;
                state.isError = true;
            });
    },
});

export const {
    reset,
    selectChat,
    establishSocket,
    loadMessageRoom,
    addNotifications,
    removeNotifications,
    lastestMessage,
    addChat,
} = chatSlice.actions;
export default chatSlice.reducer;
