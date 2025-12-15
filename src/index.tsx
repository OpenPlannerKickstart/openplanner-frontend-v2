import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './styles/globals.scss';
import './index.css';
import './styles/new-frontend-styles.css';
import './styles/calendar.css';
import './styles/courses.css';
import './styles/tasks.css';
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
// MSW worker (dev only)
async function startMocksIfNeeded() {
  const featureGroups = (window as any).FEATURE_GROUPS ?? (process.env.FEATURE_GROUPS === 'true');
  if (process.env.NODE_ENV === 'development' && featureGroups) {
    const { worker } = await import('./mocks/browser');
    await worker.start({ onUnhandledRequest: 'bypass' });
  }
}
startMocksIfNeeded();

const SOCKET_SERVER_URL = 'http://localhost:3000'; // Update with your server URL

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// Socket.IO Client Instance
// const socket = io("http://192.168.1.109:4003");

// function NotificationProvider({ children }: { children: React.ReactNode }) {
//   useEffect(() => {
//     socket.on('receiveNotification', (data) => {
//       console.log('📩 Notification received:', data);
//       // Handle notification display logic
//       alert(`Notification: ${data.message}`);
//     });

//     return () => {
//       socket.off('receiveNotification');
//     };
//   }, []);

// return <>{children}</>;
// }

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
