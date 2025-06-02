import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface NotificationInitializeState {
    notificationData: any;
    countOfUnreadNotificationData: any;
    readNotificationData: any;
    readAllNotificationData: any;
    clearNotificationData: any;
    clearAllNotificationData: any;

    loading: boolean;
}

const initialState: NotificationInitializeState = {
    notificationData: null,
    countOfUnreadNotificationData: null,
    readNotificationData: null,
    readAllNotificationData: null,
    clearNotificationData: null,
    clearAllNotificationData: null,

    loading: false,
};


const notificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {
        // Fetch User Data
        getAllNotificationSuccess: (state: NotificationInitializeState = initialState, action: PayloadAction<any>) => {
            state.notificationData = action.payload;
            state.loading = false;
        },
        getAllNotificationFailure: (state) => {
            state.notificationData = null;
            state.loading = false;
        },

        // Update User Data
        clearNotificationSuccess: (state: NotificationInitializeState = initialState, action: PayloadAction<any>) => {
            state.clearNotificationData = action.payload;
            state.loading = false;
        },
        clearNotificationFailure: (state) => {
            state.readNotificationData = null;
            state.loading = false;
        },

        // Delete User
        readNotificationSuccess: (state: NotificationInitializeState = initialState, action: PayloadAction<any>) => {
            state.clearNotificationData = action.payload;
            state.loading = false;
        },
        readNotificationFailure: (state) => {
            state.clearNotificationData = null;
            state.loading = false;
        },

        // Change Password
        getCountOfUnreadNotificationSuccess: (state: NotificationInitializeState = initialState, action: PayloadAction<any>) => {
            state.countOfUnreadNotificationData = action.payload;
            state.loading = false;
        },
        getCountOfUnreadNotificationFailure: (state) => {
            state.countOfUnreadNotificationData = null;
            state.loading = false;
        },
    },
});

export const {
    getAllNotificationSuccess,
    getAllNotificationFailure,
    clearNotificationSuccess,
    clearNotificationFailure,
    readNotificationSuccess,
    readNotificationFailure,
    getCountOfUnreadNotificationSuccess,
    getCountOfUnreadNotificationFailure,
} = notificationSlice.actions;

export default notificationSlice.reducer;
