import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface signupInitializeState {
    signupData: any;
    sendSignupEmailOtp: any;
    verifySignupEmailOtp: any;
    getUniversityList: any;
    addUniversity: any;
    loading: boolean;
    subScriptionData: any;
    savedLoginData:any
}

const initialState: signupInitializeState = {
    signupData: null,
    sendSignupEmailOtp: null,
    verifySignupEmailOtp: null,
    getUniversityList: null,
    addUniversity: null,
    subScriptionData: null,
    savedLoginData:null,
    loading: false,
};

const signupSlice: any = createSlice({
    name: "signup",
    initialState,
    reducers: {
        getSignupSuccess: (
            state: signupInitializeState = initialState,
            action: PayloadAction<any>
        ) => {
            state.signupData = action.payload;
            state.loading = false;

          
        },
        getSignupFailure: (state) => {
            state.signupData = null;
            state.loading = false;
        },
        sendSignUpEmailOtpSuccess: (
            state: signupInitializeState = initialState,
            action: PayloadAction<any>
        ) => {
            state.sendSignupEmailOtp = action.payload;
            state.loading = false;
        },
        sendSignUpEmailOtpFailure: (state) => {
            state.sendSignupEmailOtp = null;
            state.loading = false;
        },
        verfiySignUpEmailOtpSuccess: (
            state: signupInitializeState = initialState,
            action: PayloadAction<any>
        ) => {
            state.verifySignupEmailOtp = action.payload;
            state.loading = false;
        },
        verfiySignUpEmailOtpFailure: (state) => {
            state.verifySignupEmailOtp = null;
            state.loading = false;
        },

        getUniversityListSuccess: (
            state: signupInitializeState = initialState,
            action: PayloadAction<any>
        ) => {
            state.getUniversityList = action.payload;
            state.loading = false;
        },
        getUniversityListFailure: (state) => {
            state.getUniversityList = null;
            state.loading = false;
        },
        addUniversitySuccess: (
            state: signupInitializeState = initialState,
            action: PayloadAction<any>
        ) => {
            state.addUniversity = action.payload;
            state.loading = false;
        },
        addUniversityFailure: (state) => {
            state.addUniversity = null;
            state.loading = false;
        },

        createCheckOutSessionSuccess: (
            state: signupInitializeState = initialState,
            action: PayloadAction<any>
        ) => {
            state.subScriptionData = action.payload;
            state.loading = false;
        },
        createCheckOutSessionFailure: (state) => {
            state.subScriptionData = null;
            state.loading = false;
        },


        savedLoginDataSuccess: (
            state: signupInitializeState = initialState,
            action: PayloadAction<any>
        ) => {
            console.log("action",action.payload)
            state.savedLoginData = action.payload;
            state.loading = false;
        },
        savedLoginDataFailure: (state) => {
            state.savedLoginData = null;
            state.loading = false;
        },

    },
});

export const { getSignupFailure, 
    getSignupSuccess,
    verfiySignUpEmailOtpFailure,
    verfiySignUpEmailOtpSuccess,
    sendSignUpEmailOtpFailure,
    sendSignUpEmailOtpSuccess,
    getUniversityListSuccess,
    getUniversityListFailure,
    addUniversitySuccess,
    addUniversityFailure,
    createCheckOutSessionFailure,
    createCheckOutSessionSuccess,
    savedLoginDataSuccess,
savedLoginDataFailure


} = signupSlice.actions;
export default signupSlice?.reducer;