import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface SettingsInitializeState {
    userData: any;
    updateUserResponse: any;
    deleteUserResponse: any;
    changePasswordResponse: any;
    getSettingsData: any;
    updateSettingsData: any
    hasUnsavedChanges?: boolean;
    billingData?: any;
    updatePlan?: any;
    cancelSubscription?: any;
    getAllPlans?: any;
    loading: boolean;
}

const initialState: SettingsInitializeState = {
    userData: null,
    updateUserResponse: null,
    deleteUserResponse: null,
    changePasswordResponse: null,
    getSettingsData: null,
    updateSettingsData: null,
    billingData: null,
    cancelSubscription: null,
    hasUnsavedChanges: false,
    updatePlan: null,
    getAllPlans: null,
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
            // keep the canonical user snapshot up-to-date (used in header menus across pages)
            state.userData = action.payload;
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

        cancelSubscriptionSuccess: (state: SettingsInitializeState = initialState, action: PayloadAction<any>) => {
            state.cancelSubscription = action.payload;
            state.loading = false;
        },
        cancelSubscriptionFailure: (state) => {
            state.cancelSubscription = null;
            state.loading = false;
        },


        getTransactionSuccess: (state: SettingsInitializeState = initialState, action: PayloadAction<any>) => {
            state.billingData = action.payload;
            state.loading = false;
        },
        getTransactionFailure: (state) => {
            state.billingData = null;
            state.loading = false;
        },

        updatePlanSuccess: (state: SettingsInitializeState = initialState, action: PayloadAction<any>) => {
            state.updatePlan = action.payload;
            state.loading = false;
        },
        updatePlanFailure: (state) => {
            state.updatePlan = null;
            state.loading = false;
        },

        getAllPlanSuccess: (state: SettingsInitializeState = initialState, action: PayloadAction<any>) => {
            state.getAllPlans = action.payload;
            state.loading = false;
        },
        getAllPlanFailure: (state) => {
            state.getAllPlans = null;
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
    hasUnsavedChanges,
    getTransactionFailure,
    getTransactionSuccess,
    cancelSubscriptionFailure,
    cancelSubscriptionSuccess,
    updatePlanSuccess,
    updatePlanFailure,
    getAllPlanSuccess,
    getAllPlanFailure
} = settingsSlice.actions;

export default settingsSlice.reducer;
