import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface signupInitializeState {
    signupData: any;
    sendSignupEmailOtp: any;
    verifySignupEmailOtp: any;
    loading: boolean;
}

const initialState: signupInitializeState = {
    signupData: null,
    sendSignupEmailOtp: null,
    verifySignupEmailOtp: null,
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

    },
});

export const { getSignupFailure, 
    getSignupSuccess,
    verfiySignUpEmailOtpFailure,
    verfiySignUpEmailOtpSuccess,
    sendSignUpEmailOtpFailure,
    sendSignUpEmailOtpSuccess


} = signupSlice.actions;
export default signupSlice?.reducer;