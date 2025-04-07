import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ForgotPasswordInitializeState {
    sendEmailOtpForPasswordData: any;
    setNewPasswordData: any;
    loading: boolean;
}

const initialState: ForgotPasswordInitializeState = {
    sendEmailOtpForPasswordData: null,
    setNewPasswordData: null,
    loading: false,
};

const forgotPasswordSlice: any = createSlice({
    name: "forgotPassword",
    initialState,
    reducers: {
        sendEmailOtpForPasswordSuccess: (
            state: ForgotPasswordInitializeState = initialState,
            action: PayloadAction<any>
        ) => {
            state.sendEmailOtpForPasswordData = action.payload;
            state.loading = false;
        },
        sendEmailOtpForPasswordFailure: (state) => {
            state.sendEmailOtpForPasswordData = null;
            state.loading = false;
        },
        sendNewPasswordDataSuccess: (
            state: ForgotPasswordInitializeState = initialState,
            action: PayloadAction<any>
        ) => {
            state.setNewPasswordData = action.payload;
            state.loading = false;
        },
        sendNewPasswordDataFailure: (state) => {
            state.setNewPasswordData = null;
            state.loading = false;
        },
    },
});

export const { sendEmailOtpForPasswordSuccess,
    sendEmailOtpForPasswordFailure,
     sendNewPasswordDataSuccess,
     sendNewPasswordDataFailure
    } = forgotPasswordSlice.actions;
export default forgotPasswordSlice?.reducer;