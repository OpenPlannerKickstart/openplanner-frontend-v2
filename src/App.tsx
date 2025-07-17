import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import './assets/css/bootstrap-icons.css';
import './assets/css/material-icon.css';
import "./assets/css/icon.css";
import "./assets/css/fonts.css";
import { Toaster } from 'react-hot-toast';
import Loader from './common/Loader';
import { RootState } from './redux/store';
import { connect, useDispatch } from 'react-redux';
import AppRouter from './routes';
import { useSelector } from "react-redux";

/**
 * App Component
 * @param {object} props - Props passed to the component
 * @returns {JSX.Element} JSX element representing the App component
 */
function App(props) {
  /** Flag variable for toaster position */
  const flg = false;
  const loading = useSelector(
    (state: RootState) => state.LoaderReducer.loading
  );


  return (
    <div>
      {/* Toaster component for displaying notifications */}
      <Toaster position="top-right" reverseOrder={flg} />
      {/* Loader component to show loading indicator */}
      <Loader loading={loading} />
      {/* AppRouter component for routing */}
      <AppRouter />
    </div>
  );
}

export default App;
