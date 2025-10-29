// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';
// import 'bootstrap/dist/js/bootstrap.bundle.min';
// import reportWebVitals from './reportWebVitals';
// import store from './redux/store';
// import { Provider } from 'react-redux';
// import {
//   StompSessionProvider,
//   // useSubscription,
// } from "react-stomp-hooks";
// import { WEB_SOCKET_CONNECTION_URL } from './Utility/Config';
// import "react-datepicker/dist/react-datepicker.css";
// import 'react-phone-input-2/lib/style.css'
// import 'react-big-calendar/lib/css/react-big-calendar.css';
// import { Worker } from '@react-pdf-viewer/core';
// // import '@react-pdf-viewer/core/lib/styles/index.css';
// import '@react-pdf-viewer/core/lib/styles/index.css';
// import '@react-pdf-viewer/default-layout/lib/styles/index.css';
// // import 'add-to-calendar-button-react/dist/style.css';
// // import '@react-pdf-viewer/core/lib/styles/index.css';

// const root = ReactDOM.createRoot(
//   document.getElementById('root') as HTMLElement
// );
// root.render(
//   <StompSessionProvider

//     url={WEB_SOCKET_CONNECTION_URL}
//     debug={(str) => {
//       console.log(str);

//     }}
//     heartbeatIncoming={2000}
//     heartbeatOutgoing={2000}
//   >
//     <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
//       <Provider store={store}>
//         <React.StrictMode>
//           <App />
//         </React.StrictMode>
//       </Provider>
//     </Worker>
//   </StompSessionProvider>
// );

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();


import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import reportWebVitals from './reportWebVitals';
import store from './redux/store';
import { Provider } from 'react-redux';
import { io } from 'socket.io-client';
import "react-datepicker/dist/react-datepicker.css";
import 'react-phone-input-2/lib/style.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { NotificationProvider } from './context/SocketContext';

const SOCKET_SERVER_URL = 'http://localhost:3000'; // Update with your server URL

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// Socket.IO Client Instance
// const socket = io("http://192.168.1.109:4003");

root.render(
  <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
    <Provider store={store}>
      <React.StrictMode>
        <NotificationProvider>
          <App />
        </NotificationProvider>
      </React.StrictMode>
    </Provider>
  </Worker>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
