import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface GenericInitializeState {
  dropdownData: any;
  allNotificationsData: any;
  websocketConnectionData: any;
  countryData: any;
  stateData: any;
  cityData: any;
  defaultRedux: any;
  loading: boolean;
}

const initialState: GenericInitializeState = {
  dropdownData: null,
  allNotificationsData: null,
  websocketConnectionData: null,
  countryData: null,
  stateData: null,
  cityData: null,
  defaultRedux: null,
  loading: false,
};

const genericSlice: any = createSlice({
  name: "generic",
  initialState,
  reducers: {
    getDropdownSuccess: (
      state: GenericInitializeState = initialState,
      action: PayloadAction<any>
    ) => {
      state.dropdownData = action.payload;
      state.loading = false;
    },
    getDropdownFailure: (state) => {
      state.dropdownData = null;
      state.loading = false;
    },
    getAllNotificationsSuccess: (
      state: GenericInitializeState = initialState,
      action: PayloadAction<any>
    ) => {
      state.allNotificationsData = action.payload;
      state.loading = false;
    },
    getAllNotificationsFailure: (state) => {
      state.allNotificationsData = null;
      state.loading = false;
    },
    getWebsocketConnectionSuccess: (
      state: GenericInitializeState = initialState,
      action: PayloadAction<any>
    ) => {
      state.websocketConnectionData = action.payload;
      state.loading = false;
    },
    getWebsocketConnectionFailure: (state) => {
      state.websocketConnectionData = null;
      state.loading = false;
    },
    getCountryDataSuccess: (
      state: GenericInitializeState = initialState,
      action: PayloadAction<any>
    ) => {
      state.countryData = action.payload;
      state.loading = false;
    },
    getCountryDataFailure: (state) => {
      state.countryData = null;
      state.loading = false;
    },
    getStateDataSuccess: (
      state: GenericInitializeState = initialState,
      action: PayloadAction<any>
    ) => {
      state.stateData = action.payload;
      state.loading = false;
    },
    getStateDataFailure: (state) => {
      state.stateData = null;
      state.loading = false;
    },
    getCityDataSuccess: (
      state: GenericInitializeState = initialState,
      action: PayloadAction<any>
    ) => {
      state.cityData = action.payload;
      state.loading = false;
    },
    getCityDataFailure: (state) => {
      state.cityData = null;
      state.loading = false;
    },
    getDefaultReduxSuccess: (
      state: GenericInitializeState = initialState,
      action: PayloadAction<any>
    ) => {
      state.defaultRedux = action.payload;
      state.loading = false;
    },
    getDefaultReduxFailure: (state) => {
      state.defaultRedux = null;
      state.loading = false;
    },
    resetGenericData: (state: GenericInitializeState = initialState) => {
      state.dropdownData = null;
      state.allNotificationsData = null;
      state.websocketConnectionData = null;
      state.countryData = null;
      state.stateData = null;
      state.cityData = null;
      state.defaultRedux = null;
      state.loading = false;
    },
  },
});

export const {
  getDropdownSuccess,
  getDropdownFailure,
  getAllNotificationsSuccess,
  getAllNotificationsFailure,
  getWebsocketConnectionSuccess,
  getWebsocketConnectionFailure,
  getCountryDataSuccess,
  getCountryDataFailure,
  getStateDataSuccess,
  getStateDataFailure,
  getCityDataSuccess,
  getCityDataFailure,
  getDefaultReduxSuccess,
  getDefaultReduxFailure,
} = genericSlice.actions;

export default genericSlice?.reducer;
