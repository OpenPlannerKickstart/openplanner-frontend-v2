import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
// Import dark mode overrides AFTER legacy SCSS to ensure they take precedence
import './styles/new-frontend-styles.css';
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
import InstagramBrowserPrompt from './components/InstagramBrowserPrompt/InstagramBrowserPrompt';
import { SyllabusUploadProvider } from './context/SyllabusUploadContext';
import { ThemeProvider } from './context/ThemeContext';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from './lib/queryClient';

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
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <SyllabusUploadProvider>
          <div>
            {/* Instagram browser prompt */}
            <InstagramBrowserPrompt />
            {/* Toaster component for displaying notifications */}
            <Toaster position="top-right" reverseOrder={flg} />
            {/* Loader component to show loading indicator */}
            <Loader loading={loading} />
            {/* AppRouter component for routing */}
            <AppRouter />
          </div>
        </SyllabusUploadProvider>
      </ThemeProvider>
      {/* React Query Devtools - only visible in development */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
