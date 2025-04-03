import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import reportWebVitals from './reportWebVitals';
import store from './redux/store';
import { Provider } from 'react-redux';
import {
  StompSessionProvider,
  // useSubscription,
} from "react-stomp-hooks";
import { WEB_SOCKET_CONNECTION_URL } from './Utility/Config';
import "react-datepicker/dist/react-datepicker.css";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  // <StompSessionProvider

  // url={WEB_SOCKET_CONNECTION_URL}
  // debug={(str) => {
  //   console.log(str);

  // }}>
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>
  // </StompSessionProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
