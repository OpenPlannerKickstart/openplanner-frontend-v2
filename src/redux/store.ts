import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== "production",
});

/**Defining types for better type safety  */
/** Type representing the state of the Redux store */
export type RootState = ReturnType<typeof store.getState>;

/** Type representing the dispatch function of the Redux store */
export type AppDispatch = typeof store.dispatch;

export default store;
