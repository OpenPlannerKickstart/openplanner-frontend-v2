import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LoginInitializeState {
  loginData: any;
  loading: boolean;
}

const initialState: LoginInitializeState = {
  loginData: null,
  loading: false,
};

const loginSlice: any = createSlice({
  name: "login",
  initialState,
  reducers: {
    getLoginSuccess: (
      state: LoginInitializeState = initialState,
      action: PayloadAction<any>
    ) => {
      state.loginData = action.payload;
      state.loading = false;
    },
    getLoginFailure: (state) => {
      state.loginData = null;
      state.loading = false;
    },
  },
});

export const { getLoginSuccess, getLoginFailure } = loginSlice.actions;
export default loginSlice?.reducer;
