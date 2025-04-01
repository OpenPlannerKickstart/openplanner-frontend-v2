import { combineReducers } from "@reduxjs/toolkit";
import LoginReducer from "./auth/Login/loginSlice";
import GenericReducer from "./Generic/genericSlice";
import LoaderReducer from "./Loader/LoaderSlice";

const rootReducer = combineReducers({
  LoginReducer,
  LoaderReducer,
  GenericReducer,
});

export default rootReducer;
