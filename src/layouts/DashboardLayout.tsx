import React, { createContext, useContext, useMemo, useState } from 'react';
import Sidebar from '../components/Sidebar/Sidebar';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../redux/store';
import { getAllNotificationAPI, getCountOfUnreadNotificationAPI } from '../redux/Service/User/Notification/notification';
import NotificationPanel from '../components/Notifications/NotificationPanel';
import { NotificationPanelProvider } from '../components/Notifications/NotificationPanelContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

interface SidebarContextType {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within DashboardLayout');
  }
  return context;
};

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const dispatch: AppDispatch = useDispatch();
  const unreadCountRaw = useSelector((state: RootState) => state.NotificationReducer.countOfUnreadNotificationData);
  const unreadCount = Number.isFinite(Number(unreadCountRaw)) ? Number(unreadCountRaw) : 0;

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const openNotifications = async () => {
    setIsNotificationOpen(true);
    try {
      await dispatch(getAllNotificationAPI());
      await dispatch(getCountOfUnreadNotificationAPI());
    } catch {
      // Panel stays open even if fetch fails
    }
  };

  const closeNotifications = () => setIsNotificationOpen(false);
  const toggleNotifications = () => (isNotificationOpen ? closeNotifications() : void openNotifications());

  const notificationCtx = useMemo(() => ({
    isOpen: isNotificationOpen,
    open: openNotifications,
    close: closeNotifications,
    toggle: toggleNotifications,
    unreadCount,
  }), [isNotificationOpen, unreadCount]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <SidebarContext.Provider value={{ isSidebarOpen, toggleSidebar }}>
      <NotificationPanelProvider value={notificationCtx}>
        <div className="dashboard-layout">
          <Sidebar isOpen={isSidebarOpen} onToggleOpen={toggleSidebar} />
          <main className="dashboard-main">
            {children}
          </main>
          <NotificationPanel />
        </div>
      </NotificationPanelProvider>
    </SidebarContext.Provider>
  );
};

export default DashboardLayout;
