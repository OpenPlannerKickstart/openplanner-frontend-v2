import React, { createContext, useContext, useState } from 'react';
import Sidebar from '../components/Sidebar/Sidebar';

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

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <SidebarContext.Provider value={{ isSidebarOpen, toggleSidebar }}>
      <div className="dashboard-layout">
        <Sidebar isOpen={isSidebarOpen} onToggleOpen={toggleSidebar} />
        <main className="dashboard-main">
          {children}
        </main>
      </div>
    </SidebarContext.Provider>
  );
};

export default DashboardLayout;
