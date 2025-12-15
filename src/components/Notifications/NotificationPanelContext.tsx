import React, { createContext, useContext } from 'react';

export type NotificationPanelContextValue = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  unreadCount: number;
};

const NotificationPanelContext = createContext<NotificationPanelContextValue | undefined>(undefined);

export const NotificationPanelProvider = NotificationPanelContext.Provider;

export const useNotificationPanel = () => {
  const ctx = useContext(NotificationPanelContext);
  if (!ctx) throw new Error('useNotificationPanel must be used within NotificationPanelProvider');
  return ctx;
};


