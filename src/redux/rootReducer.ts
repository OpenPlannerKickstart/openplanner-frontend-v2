import { combineReducers } from "@reduxjs/toolkit";
import LoginReducer from "./auth/Login/loginSlice";
import GenericReducer from "./Generic/genericSlice";
import LoaderReducer from "./Loader/LoaderSlice";
import SignupReducer from "./auth/Signup/signupSlice";
import ForgotPasswordReducer from "./auth/ForgotPassword/forgotPasswordSlice";
import CalenderReducer from './Calender/calenderSlice'

import CoursesReducer from "./User/Courses/coursesSlice";
import TaskReducer from "./Task/taskSlice";
import SettingsReducer from "./Settings/settingsSlice";
const rootReducer = combineReducers({
  LoginReducer,
  LoaderReducer,
  GenericReducer,
  SignupReducer,
  ForgotPasswordReducer,
  CalenderReducer,
  CoursesReducer,
  TaskReducer,
  SettingsReducer

});

export default rootReducer;
