import React, { useState, useEffect, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import './Sidebar.scss';
import logo from '../../assets/images/sidebar-logo-lg.svg';
import { isGroupsEnabled } from '../../config/featureFlags';
import { useSyllabusDropdown } from '../../hooks/queries/useSyllabusDropdown';
import { queryKeys } from '../../lib/queryKeys';
import { fetchCalendarEvents } from '../../api/events';

interface SidebarProps {
  isOpen?: boolean;
  onToggleOpen?: (open?: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen: externalIsOpen, onToggleOpen }) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const queryClient = useQueryClient();

  // Get syllabus data for calendar prefetching
  const { data: syllabusData = [] } = useSyllabusDropdown();

  // Use external control if provided, otherwise use internal state
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = (onToggleOpen as any) || setInternalIsOpen;

  // Prefetch calendar events on hover (for instant Calendar page load)
  // Must match exactly how CalendarEvent.tsx constructs syllabusIds
  const prefetchCalendarEvents = useCallback(() => {
    console.log('[Sidebar] Hover detected, syllabusData:', syllabusData.length, 'items');
    
    if (syllabusData.length === 0) {
      console.log('[Sidebar] No syllabus data yet, skipping prefetch');
      return;
    }
    
    // Calendar page uses: syllabusDropDownData.map((item) => item.value)
    const syllabusIds = syllabusData.map((item: any) => item.value).filter(Boolean);
    console.log('[Sidebar] Syllabus IDs:', syllabusIds);
    
    if (syllabusIds.length === 0) {
      console.log('[Sidebar] No valid syllabus IDs found');
      return;
    }

    console.log('[Sidebar] Prefetching calendar events for', syllabusIds.length, 'syllabi');
    
    // Prefetch only if not already cached/fresh
    queryClient.prefetchQuery({
      queryKey: [...queryKeys.events, 'calendar', syllabusIds],
      queryFn: () => fetchCalendarEvents(syllabusIds),
    });
  }, [syllabusData, queryClient]);

  // Close sidebar on mobile when clicking a link
  const handleLinkClick = () => {
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  // Toggle collapsed state (desktop only)
  const handleToggleCollapse = () => {
    if (window.innerWidth >= 1024) {
      const newCollapsedState = !isCollapsed;
      setIsCollapsed(newCollapsedState);
      localStorage.setItem('sidebarCollapsed', String(newCollapsedState));
    }
  };

  // Load collapsed state from localStorage
  useEffect(() => {
    const savedCollapsed = localStorage.getItem('sidebarCollapsed');
    if (savedCollapsed === 'true') {
      setIsCollapsed(true);
    }
  }, []);

  // Auto-open on desktop, auto-close when transitioning to mobile
  useEffect(() => {
    // Set initial state based on screen size
    if (window.innerWidth >= 1024) {
      setIsOpen(true);
    }

    // Track previous width to detect breakpoint crossing
    let prevWidth = window.innerWidth;

    const handleResize = () => {
      const currentWidth = window.innerWidth;
      const wasDesktop = prevWidth >= 1024;
      const isDesktop = currentWidth >= 1024;

      // Close sidebar when transitioning from desktop to mobile
      if (wasDesktop && !isDesktop) {
        setIsOpen(false);
      }

      prevWidth = currentWidth;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setIsOpen]);

  const sidebarClasses = [
    'sidebar',
    isOpen ? 'open' : '',
    isCollapsed ? 'collapsed' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <>
      {/* Sidebar */}
      <aside className={sidebarClasses} id="sidebar">
        <div className="sidebar-header">
          <a href="/dashboard" className="sidebar-logo">
            <img src={logo} alt="Open Planner" />
          </a>

          {/* Mobile close button */}
          <button
            className="sidebar-close"
            onClick={() => setIsOpen(false)}
            aria-label="Close sidebar"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          {/* Desktop toggle button */}
          <button
            className="sidebar-toggle"
            onClick={handleToggleCollapse}
            title="Toggle Sidebar"
            aria-label="Toggle sidebar"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        </div>

        <nav className="sidebar-nav">
          <NavLink
            to="/dashboard"
            className="sidebar-link"
            data-tooltip="My Week"
            onClick={handleLinkClick}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 10.5L12 3l9 7.5" />
              <path d="M4 10v10a2 2 0 0 0 2 2h4v-6h4v6h4a2 2 0 0 0 2-2V10" />
            </svg>
            <span>My Week</span>
          </NavLink>

          <NavLink
            to="/calendar"
            className="sidebar-link"
            data-tooltip="Calendar"
            onClick={handleLinkClick}
            onMouseEnter={prefetchCalendarEvents}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
              <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" />
            </svg>
            <span>Calendar</span>
          </NavLink>

          <NavLink
            to="/courses"
            className="sidebar-link"
            data-tooltip="Courses"
            onClick={handleLinkClick}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
            <span>Courses</span>
          </NavLink>

          <NavLink
            to="/task"
            className="sidebar-link"
            data-tooltip="Task List"
            onClick={handleLinkClick}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
            <span>Task List</span>
          </NavLink>

          {isGroupsEnabled() && (
            <NavLink
              to="/groups"
              className="sidebar-link"
              data-tooltip="Groups"
              onClick={handleLinkClick}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span>Groups</span>
            </NavLink>
          )}

          <NavLink
            to="/settings"
            className="sidebar-link"
            data-tooltip="Settings"
            onClick={handleLinkClick}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            <span>Settings</span>
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <p>© 2025 Open Planner</p>
        </div>
      </aside>

      {/* Sidebar Backdrop (Mobile) */}
      <div
        className={`sidebar-backdrop ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(false)}
      />
    </>
  );
};

export default Sidebar;
