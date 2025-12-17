import React, { createContext, useContext, useMemo, useState, useCallback, useEffect } from 'react';
import Sidebar from '../components/Sidebar/Sidebar';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../redux/store';
import { getAllNotificationAPI, getCountOfUnreadNotificationAPI } from '../redux/Service/User/Notification/notification';
import NotificationPanel from '../components/Notifications/NotificationPanel';
import { NotificationPanelProvider } from '../components/Notifications/NotificationPanelContext';
import { get } from '../Utility/httpInterceptor';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

interface SidebarContextType {
  isSidebarOpen: boolean;
  toggleSidebar: (open?: boolean) => void;
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
  const notificationList: any[] = useSelector((state: RootState) => state.NotificationReducer.notificationData) || [];
  const [inviteCounts, setInviteCounts] = useState<{ total: number; unread: number }>({ total: 0, unread: 0 });

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const toggleSidebar = useCallback((open?: boolean) => {
    setIsSidebarOpen((prev) => (typeof open === 'boolean' ? open : !prev));
  }, []);

  const getInviteReadSet = () => {
    try { return new Set<string>(JSON.parse(localStorage.getItem('op_invite_read') || '[]')); } catch { return new Set<string>(); }
  };

  const refreshInvitesCount = useCallback(async () => {
    try {
      const res: any = await get('invites');
      const data = res?.data ?? res;
      const list: any[] = data?.invites ?? [];
      const readSet = getInviteReadSet();
      const unread = Array.isArray(list) ? list.filter((it) => it && it.id && !readSet.has(String(it.id))).length : 0;
      setInviteCounts({ total: Array.isArray(list) ? list.length : 0, unread });
    } catch {
      setInviteCounts({ total: 0, unread: 0 });
    }
  }, []);

  const refreshBadge = useCallback(async () => {
    try {
      await dispatch(getAllNotificationAPI());
      await dispatch(getCountOfUnreadNotificationAPI());
    } catch {
      // ignore
    }
    await refreshInvitesCount();
  }, [dispatch, refreshInvitesCount]);

  useEffect(() => {
    // Ensure badge is correct on initial load
    refreshBadge();
  }, [refreshBadge]);

  const openNotifications = async () => {
    setIsNotificationOpen(true);
    await refreshBadge();
  };

  const closeNotifications = () => setIsNotificationOpen(false);
  const toggleNotifications = () => (isNotificationOpen ? closeNotifications() : void openNotifications());

  // Badge should show if:
  // - there are unread notifications, OR
  // - there are any uncleared notifications, OR
  // - there are any invites (even if "read"/dismissed), OR
  // - there are unread invites
  const hasAnyNotifications = Array.isArray(notificationList) && notificationList.length > 0;
  const hasAnyInvites = inviteCounts.total > 0;
  const badgeCount =
    unreadCount > 0
      ? unreadCount + (inviteCounts.unread || 0)
      : (inviteCounts.unread > 0
          ? inviteCounts.unread
          : (hasAnyNotifications || hasAnyInvites ? 1 : 0));

  const notificationCtx = useMemo(() => ({
    isOpen: isNotificationOpen,
    open: openNotifications,
    close: closeNotifications,
    toggle: toggleNotifications,
    unreadCount: badgeCount,
    refresh: () => { void refreshBadge(); },
  }), [isNotificationOpen, badgeCount, refreshBadge]); // eslint-disable-line react-hooks/exhaustive-deps

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
