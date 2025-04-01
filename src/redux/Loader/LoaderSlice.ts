import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface LoaderInitializeState {
  loading: boolean;
  loadingCounter: any;
}

const initialState: LoaderInitializeState = {
  loading: false,
  loadingCounter: 0,
};

const LoaderSlice = createSlice({
  name: 'Loader',
  initialState,
  reducers: {
    setLoading: (
      state: LoaderInitializeState = initialState,
      action: PayloadAction<any>
    ) => {
      state.loading = action?.payload;
      state.loadingCounter = action?.payload
        ? state.loadingCounter + 1
        : state.loadingCounter > 0
          ? state.loadingCounter - 1
          : 0;
    },
  },
});
export const { setLoading } = LoaderSlice.actions;
export default LoaderSlice?.reducer;
