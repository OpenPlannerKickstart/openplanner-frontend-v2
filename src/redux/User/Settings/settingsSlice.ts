import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface SettingsInitializeState {
    userData: any;
    updateUserResponse: any;
    deleteUserResponse: any;
    changePasswordResponse: any;
    getSettingsData: any;
    updateSettingsData: any
    hasUnsavedChanges?: boolean;
    loading: boolean;
}

const initialState: SettingsInitializeState = {
    userData: null,
    updateUserResponse: null,
    deleteUserResponse: null,
    changePasswordResponse: null,
    getSettingsData: null,
    updateSettingsData: null,
    hasUnsavedChanges: false,
    loading: false,
};

const settingsSlice = createSlice({
    name: "settings",
    initialState,
    reducers: {
        // Fetch User Data
        getUserSuccess: (state: SettingsInitializeState = initialState, action: PayloadAction<any>) => {
            state.userData = action.payload;
            state.loading = false;
        },
        getUserFailure: (state) => {
            state.userData = null;
            state.loading = false;
        },

        // Update User Data
        updateUserSuccess: (state: SettingsInitializeState = initialState, action: PayloadAction<any>) => {
            state.updateUserResponse = action.payload;
            state.loading = false;
        },
        updateUserFailure: (state) => {
            state.updateUserResponse = null;
            state.loading = false;
        },

        // Delete User
        deleteUserSuccess: (state: SettingsInitializeState = initialState, action: PayloadAction<any>) => {
            state.deleteUserResponse = action.payload;
            state.userData = null; // Optionally clear user data on deletion
            state.loading = false;
        },
        deleteUserFailure: (state) => {
            state.deleteUserResponse = null;
            state.loading = false;
        },

        // Change Password
        changePasswordSuccess: (state: SettingsInitializeState = initialState, action: PayloadAction<any>) => {
            state.changePasswordResponse = action.payload;
            state.loading = false;
        },
        changePasswordFailure: (state) => {
            state.changePasswordResponse = null;
            state.loading = false;
        },


        getSettingsDataSuccess: (state: SettingsInitializeState = initialState, action: PayloadAction<any>) => {
            state.getSettingsData = action.payload;
            state.loading = false;
        },
        getSettingsDataFailure: (state) => {
            state.getSettingsData = null;
            state.loading = false;
        },


        updateSettingsSuccess: (state: SettingsInitializeState = initialState, action: PayloadAction<any>) => {
            state.updateSettingsData = action.payload;
            state.loading = false;
        },
        updateSettingsFailure: (state) => {
            state.updateSettingsData = null;
            state.loading = false;
        },

        hasUnsavedChanges: (state: SettingsInitializeState = initialState, action: PayloadAction<any>) => {
            state.hasUnsavedChanges = action.payload;
            state.loading = false;
        },
     
    },
});

export const {
    getUserSuccess,
    getUserFailure,
    updateUserSuccess,
    updateUserFailure,
    deleteUserSuccess,
    deleteUserFailure,
    changePasswordSuccess,
    changePasswordFailure,
    getSettingsDataFailure,
    getSettingsDataSuccess,
    updateSettingsFailure,
    updateSettingsSuccess,
    hasUnsavedChanges
} = settingsSlice.actions;

export default settingsSlice.reducer;
