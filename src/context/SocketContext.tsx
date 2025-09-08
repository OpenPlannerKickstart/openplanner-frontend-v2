import React, { useEffect, createContext, useContext, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { API_URL } from '../Utility/Config';

const socket: Socket = io(API_URL);

const NotificationContext = createContext({
    subscribeToPath: (path: string, callback: (data: any) => void) => { },
    unsubscribeFromPath: (path: string, callback: (data: any) => void) => { },
    sendNotification: (path: string, data: any) => { },
});

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const ensureConnected = () => {
        return new Promise<void>((resolve) => {
            if (socket.connected) {
                resolve();
            } else {
                socket.once('connect', () => {
                    resolve();
                });
            }
        });
    };

    // Now unsubscribeFromPath requires the callback reference
    const subscribeToPath = (path: string, callback: (data: any) => void) => {
        socket.on(path, callback);
    };
    const unsubscribeFromPath = (path: string, callback: (data: any) => void) => {
        socket.off(path, callback);
    };

    const sendNotification = async (path: string, data: any) => {
        await ensureConnected();
        socket.emit(path, data);
    };

    useEffect(() => {
        socket.on('connect', () => {
            // console.log(`✅ WebSocket connected with ID: ${socket.id}`);
        });
        return () => {
            socket.removeAllListeners();
        };
    }, []);

    return (
        <NotificationContext.Provider value={{ subscribeToPath, unsubscribeFromPath, sendNotification }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    return useContext(NotificationContext);
};