import React, { useEffect, useState, useRef } from 'react';
import { AppDispatch, RootState } from '../../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import {
  dashboardEventListingAPI,
  syllabusDropDownAPI,
  deleteEventAPI,
} from '../../../redux/Service/User/DashBoard/dashboard';
import {
  customJsonInclude,
  formatedDate,
  getDate,
  isEmptyObjectOrNullUndefiend,
  isNullUndefinedOrBlank,
} from '../../../Utility/Helper';
import { isUpdatedSyllabus } from '../../../redux/User/Courses/coursesSlice';
import AddEditEvent from '../../../common/AddSyllabusEvents/AddEditEvent';
import AddEditSyllabus from '../../../common/AddSyllabusEvents/AddEditSyllabus';
import ConfirmDeleteModal from '../../../components/ConfirmDeleteModal/ConfirmDeleteModal';
import moment from 'moment';
import { ENUMFORROUTES, ENUMFORSTATUS } from '../../../interfaces/enum';
import { updateEventStatusDataAPI } from '../../../redux/Service/User/Courses/courses';
import { useNavigate } from 'react-router-dom';
import { logoutFromSystem } from '../../../redux/Service/auth/login';
import { getUserAPI } from '../../../redux/Service/User/Settings/settings';
import { useSidebar } from '../../../layouts/DashboardLayout';
import { useNotificationPanel } from '../../../components/Notifications/NotificationPanelContext';
import { useReferralUploadLimit } from '../../../hooks/useReferralUploadLimit';
import ReferralUnlockModal from '../../../components/ReferralUnlockModal/ReferralUnlockModal';

const Dashboard = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { toggleSidebar } = useSidebar();
  const { open: openNotifications, unreadCount } = useNotificationPanel();

  const coursesData: any = useSelector((state: RootState) => state.CoursesReducer);
  const settingsData: any = useSelector((state: RootState) => state.SettingsReducer);

  /** -----------------User menu and notification state---------------------------*/
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const [showAppPromo, setShowAppPromo] = useState(false);

  /** -----------------event listing api start---------------------------*/
  const [eventData, setEventData] = useState<any>([]);
  const [todayDate, setTodayDate] = useState<any>(null);
  const [startDate, setStartDate] = useState(moment().startOf('week').format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(moment().endOf('week').format('YYYY-MM-DD'));
  /**
   * Course pill filter (multi-select)
   * - null: not initialized yet (treat as "all active")
   * - []: no courses active (hides course-tied events)
   * - [ids...]: only show events whose courseId is in the set (course-less events always show)
   */
  const [activeCourseIds, setActiveCourseIds] = useState<string[] | null>(null);
  const isOnTodayWeek =
    moment(startDate).isSame(moment().startOf('week'), 'day') &&
    moment(endDate).isSame(moment().endOf('week'), 'day');

  useEffect(() => {
    const dismissed = localStorage.getItem('openPlannerAppPromoDismissed');
    setShowAppPromo(!dismissed);
  }, []);

  const normalizeId = (id: string | number | null | undefined) =>
    id === null || typeof id === 'undefined' ? null : String(id);

  const getCourseIdFromPillItem = (item: any): string | number | null => {
    return (
      item?.id ??
      item?.value ??
      item?.syllabus_id ??
      item?.syllabusId ??
      item?.course_id ??
      item?.courseId ??
      item?.other?.id ??
      item?.other?.value ??
      item?.other?.syllabus_id ??
      item?.other?.syllabusId ??
      item?.other?.course_id ??
      item?.other?.courseId ??
      null
    );
  };

  const getCourseIdFromEvent = (event: any): string | number | null => {
    return (
      event?.syllabus_id ??
      event?.syllabusId ??
      event?.course_id ??
      event?.courseId ??
      event?.syllabus?.id ??
      event?.syllabus?._id ??
      null
    );
  };

  const toggleCourseActive = (item: any) => {
    const id = normalizeId(getCourseIdFromPillItem(item));
    if (!id) return;
    setActiveCourseIds((prev) => {
      // If not initialized yet, start from "all active"
      const base = new Set((prev ?? allCourseIds) as string[]);
      if (base.has(id)) base.delete(id);
      else base.add(id);
      return Array.from(base);
    });
  };

  const handleDateChange = (type: string) => {
    let start, end;

    if (type === 'today') {
      const today = moment();
      start = today.clone().startOf('week');
      end = today.clone().endOf('week');
      setTodayDate(today.format('YYYY-MM-DD'));
    } else if (type === 'nextWeek') {
      const nextWeek = moment(startDate).add(1, 'week');
      start = nextWeek.clone().startOf('week');
      end = nextWeek.clone().endOf('week');
      setTodayDate(null);
    } else if (type === 'prevWeek') {
      const prevWeek = moment(startDate).subtract(1, 'week');
      start = prevWeek.clone().startOf('week');
      end = prevWeek.clone().endOf('week');
      setTodayDate(null);
    }

    setStartDate(start.format('YYYY-MM-DD'));
    setEndDate(end.format('YYYY-MM-DD'));
  };

  const handleDismissAppPromo = () => {
    localStorage.setItem('openPlannerAppPromoDismissed', '1');
    setShowAppPromo(false);
  };

  const handleEventListing = async () => {
    const start_date = getDate(startDate);
    const end_date = getDate(endDate);
    const reqBody = { start_date, end_date };
    customJsonInclude(reqBody);

    console.log('[Dashboard] Fetching events with:', { start_date, end_date, reqBody });

    try {
      const response = await dispatch(dashboardEventListingAPI(reqBody));
      console.log('[Dashboard] API response:', response);
      
      if (response && !isNullUndefinedOrBlank(response)) {
        // Try multiple possible response structures
        const eventList = 
          response?.payload?.dueEventData ||
          response?.payload?.data?.dueEventData ||
          response?.payload ||
          [];
        
        console.log('[Dashboard] Setting eventData to:', eventList);
        setEventData(Array.isArray(eventList) ? eventList : []);
      } else {
        console.log('[Dashboard] Empty or invalid response, setting empty array');
        setEventData([]);
      }
    } catch (error) {
      console.error('[Dashboard] Error fetching event data:', error);
      setEventData([]);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (coursesData.isUpdatedSyllabusData) {
        handleGetDropDownData();
        setTimeout(() => {
          dispatch(isUpdatedSyllabus(false));
        }, 400);
      }
    }, 300);
    return () => {
      clearTimeout(delayDebounceFn);
    };
  }, [coursesData.isUpdatedSyllabusData]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (coursesData.isUpdatedEventData) {
        handleEventListing();
        setTimeout(() => {
          dispatch(isUpdatedSyllabus(false));
        }, 400);
      }
    }, 300);
    return () => {
      clearTimeout(delayDebounceFn);
    };
  }, [coursesData.isUpdatedEventData]);

  /** --------------------get syllabus dropdown data start------------------------*/
  const [syllabusDropDownData, setSyllabusDropDownData] = useState<any>([]);
  const handleGetDropDownData = async () => {
    const response = await dispatch(syllabusDropDownAPI());
    if (response && !isNullUndefinedOrBlank(response)) {
      setSyllabusDropDownData(response?.payload);
    }
  };

  // Derive all course ids from pills (stable, stringified)
  const allCourseIds = React.useMemo(() => {
    const ids =
      (Array.isArray(syllabusDropDownData) ? syllabusDropDownData : [])
        .map((it: any) => normalizeId(getCourseIdFromPillItem(it)))
        .filter((v: any): v is string => Boolean(v));
    return Array.from(new Set(ids));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [syllabusDropDownData]);

  // Default: all course pills active once loaded
  useEffect(() => {
    if (!Array.isArray(syllabusDropDownData) || syllabusDropDownData.length === 0) {
      // If we haven't loaded courses yet, keep "all active" (null). If courses were loaded and now empty, clear.
      setActiveCourseIds((prev) => (prev === null ? null : []));
      return;
    }
    setActiveCourseIds((prev) => {
      if (prev === null) return allCourseIds; // first-time init: all active
      // Keep previous selection when the list updates, but auto-add any new courses as active
      const prevSet = new Set(prev);
      allCourseIds.forEach((id) => prevSet.add(id));
      return Array.from(prevSet);
    });
  }, [allCourseIds, syllabusDropDownData]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleGetDropDownData();
      handleEventListing();
    }, 300);
    return () => {
      clearTimeout(delayDebounceFn);
    };
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleEventListing();
    }, 300);
    return () => {
      clearTimeout(delayDebounceFn);
    };
  }, [todayDate, startDate, endDate]);

  /** -----------------Add/Edit Event start---------------------------*/
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);

  /** ---------------Edit event start-----------------------------*/
  const [editEventFormData, setEditEventFormData] = useState<any>(null);
  const handleSelectEvent = (event: any) => {
    handleShow();
    setEditEventFormData({
      ...event,
      start_date: new Date(formatedDate(event?.start_date, 'yyyy-MM-DD HH:mm:ss')),
      end_date: new Date(formatedDate(event?.end_date, 'yyyy-MM-DD HH:mm:ss')),
    });
  };

  const handleGetUpdatedData = () => {
    handleEventListing();
  };

  /** -----------------Add/Edit syllabus start---------------------------*/
  const [showSyllabus, setShowSyllabus] = useState(false);
  const handleSyllabusShow = () => setShowSyllabus(true);

  const { hasSubscription, isFreemiumPlan } = (() => {
    try {
      const tier = localStorage.getItem('plan_tier');
      const subscriptionFlag = localStorage.getItem('has_subscription') === 'true';
      return {
        hasSubscription: subscriptionFlag,
        isFreemiumPlan: tier === 'freemium' || !subscriptionFlag,
      };
    } catch {
      return {
        hasSubscription: false,
        isFreemiumPlan: true,
      };
    }
  })();

  const {
    limitReached: freemiumLimitReached,
    upgradeRequired,
    referralLink,
    referralSentCount,
    markReferralSent,
  } = useReferralUploadLimit({
    isFreemiumPlan,
    hasSubscription,
    existingSyllabusCount: syllabusDropDownData.length,
  });

  // Referral modal state for freemium limit
  const [showReferralModal, setShowReferralModal] = useState(false);

  const handleReferralClick = () => {
    setShowReferralModal(true);
  };

  const handleAddSyllabusClick = () => {
    if (upgradeRequired) {
      navigate(ENUMFORROUTES.PLAN_DETAILS);
      return;
    }
    if (freemiumLimitReached) {
      setShowReferralModal(true);
      return;
    }
    handleSyllabusShow();
  };

  /** --------------------get Priority Class start------------------------*/
  const getPriorityColour = (priority: string) => {
    const priorityLower = priority.toLowerCase();
    const priorityMap: { [key: string]: string } = {
      high: 'priority-high',
      medium: 'priority-medium',
      low: 'priority-low',
    };
    return priorityMap[priorityLower] || '';
  };

  /** Map hex colors to CSS class names - synced with colorPalette in AddEditSyllabus */
  const getColorClassName = (hexColor: string): string => {
    const colorMap: { [key: string]: string } = {
      // New design system colors (primary)
      '#F97316': 'orange',
      '#f97316': 'orange',
      '#EAB308': 'yellow',
      '#eab308': 'yellow',
      '#22C55E': 'green',
      '#22c55e': 'green',
      '#14B8A6': 'teal',
      '#14b8a6': 'teal',
      '#D97706': 'gold',
      '#d97706': 'gold',
      '#3B82F6': 'blue',
      '#3b82f6': 'blue',
      '#cddc39': 'lime',
      '#CDDC39': 'lime',
      '#239BC2': 'cyan',
      '#239bc2': 'cyan',
      '#EF4444': 'red',
      '#ef4444': 'red',
      '#8B5CF6': 'purple',
      '#8b5cf6': 'purple',
      '#EC4899': 'pink',
      '#ec4899': 'pink',
      '#6B7280': 'gray',
      '#6b7280': 'gray',
      '#78716C': 'stone',
      '#78716c': 'stone',
      '#6366F1': 'indigo',
      '#6366f1': 'indigo',
      // Legacy color mappings (backward compatibility)
      '#ffc107': 'yellow',
      '#FFC107': 'yellow',
      '#ffeb3b': 'yellow',
      '#FFEB3B': 'yellow',
      '#4caf50': 'green',
      '#4CAF50': 'green',
      '#8bc34a': 'lime',
      '#8BC34A': 'lime',
      '#009688': 'teal',
      '#00bcd4': 'cyan',
      '#00BCD4': 'cyan',
      '#03a9f4': 'blue',
      '#03A9F4': 'blue',
      '#2196f3': 'blue',
      '#2196F3': 'blue',
      '#3f51b5': 'indigo',
      '#3F51B5': 'indigo',
      '#673ab7': 'purple',
      '#673AB7': 'purple',
      '#9c27b0': 'purple',
      '#9C27B0': 'purple',
      '#e91e63': 'pink',
      '#E91E63': 'pink',
      '#ff9800': 'orange',
      '#FF9800': 'orange',
      '#ff5722': 'orange',
      '#FF5722': 'orange',
      '#795548': 'stone',
      '#607d8b': 'gray',
      '#607D8B': 'gray',
    };
    return colorMap[hexColor] || 'cyan';
  };

  const hexToRgba = (hex: string, alpha: number): string | null => {
    if (!hex || typeof hex !== 'string') return null;
    const cleaned = hex.trim().replace('#', '');
    const normalized =
      cleaned.length === 3
        ? cleaned
            .split('')
            .map((c) => c + c)
            .join('')
        : cleaned;
    if (normalized.length !== 6) return null;
    const r = parseInt(normalized.slice(0, 2), 16);
    const g = parseInt(normalized.slice(2, 4), 16);
    const b = parseInt(normalized.slice(4, 6), 16);
    if ([r, g, b].some((n) => Number.isNaN(n))) return null;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  /** -------------------Event complete Start-------------------------*/
  const handleEventCompleted = async (id: number | number[], status: string) => {
    let event_id: any = [];
    if (id instanceof Array) {
      event_id = id;
    } else {
      event_id = [id];
    }
    const reqBody = {
      event_id: event_id,
      status: status === ENUMFORSTATUS.COMPLETED ? ENUMFORSTATUS.PENDING : ENUMFORSTATUS.COMPLETED,
    };
    // My Week: don't show "status updated successfully" toast on complete/uncomplete.
    const response = await dispatch(updateEventStatusDataAPI(reqBody, { silent: true }));
    if (response && !isNullUndefinedOrBlank(response?.payload)) {
      handleEventListing();
    }
  };

  /** -------------------Delete event start-------------------------*/
  const [deleteShow, setDeleteShow] = useState(false);
  const [deleteEventData, setdeleteEventData] = useState<Array<any>>([]);

  const handleDeleteClose = () => {
    setDeleteShow(false);
    setTimeout(() => {
      setdeleteEventData([]);
    }, 300);
  };

  const handleDeleteShow = (data: any) => {
    setdeleteEventData(data);
    setDeleteShow(true);
  };

  const handleDeleteData = async () => {
    const param = deleteEventData?.map((data) => data.id);
    const response = await dispatch(deleteEventAPI({ event_id: param }));
    if (response && !isNullUndefinedOrBlank(response?.payload)) {
      handleDeleteClose();
      handleEventListing();
    }
  };

  /** -------------------User menu and notification handlers-------------------------*/
  const handleUserMenuToggle = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleLogout = async () => {
    await dispatch(logoutFromSystem());
    navigate(ENUMFORROUTES.LOGIN);
  };

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      const response = await dispatch(getUserAPI());
      if (response && !isNullUndefinedOrBlank(response?.payload)) {
        setUserData(response.payload);
      }
    };
    fetchUserData();
  }, [dispatch]);

  // Update user data when settings data changes
  useEffect(() => {
    if (!isNullUndefinedOrBlank(settingsData?.userData)) {
      setUserData(settingsData.userData);
    }
  }, [settingsData?.userData]);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  return (
    <>
      {/* Top Header */}
      <header className="dashboard-header">
        <div className="dashboard-header-inner">
          <div className="dashboard-header-left">
            <button className="mobile-menu-toggle" onClick={() => toggleSidebar()}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>

            <h1 className="dashboard-page-title">My Week</h1>

            <button className={`today-btn ${isOnTodayWeek ? 'active' : ''}`} onClick={() => handleDateChange('today')}>
              Today
            </button>

            <div className="date-navigator">
              <button className="nav-arrow prev" onClick={() => handleDateChange('prevWeek')}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <span className="date-range">
                {formatedDate(startDate, 'MMM DD')} - {formatedDate(endDate, 'MMM DD')}
              </span>
              <button className="nav-arrow next" onClick={() => handleDateChange('nextWeek')}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </div>

          <div className="dashboard-header-right">
            <button className="btn btn-primary" onClick={handleShow}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add Event
            </button>
            <button className="btn btn-accent" onClick={handleAddSyllabusClick}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add Syllabus
            </button>

            <button className="notification-btn" type="button" onClick={openNotifications} aria-label="Notifications" title="Notifications">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              {unreadCount > 0 && <span className="notification-badge"></span>}
            </button>

            <div className="user-menu-container" ref={userMenuRef}>
              <div className="user-menu" onClick={handleUserMenuToggle}>
                <div className="user-avatar">
                  {(() => {
                    const src =
                      (userData as any)?.profile_image ||
                      (userData as any)?.profileImage ||
                      (userData as any)?.picture ||
                      (userData as any)?.avatarUrl;
                    return src ? (
                      <img
                        src={src}
                        alt="Profile"
                        style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
                      />
                    ) : (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    );
                  })()}
                </div>
                <span className="user-name">
                  {userData?.username || userData?.email?.split('@')[0] || 'User'}
                </span>
                <svg className="dropdown-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
              <div className={`user-dropdown ${isUserMenuOpen ? 'active' : ''}`}>
                <a href="#" onClick={(e) => { e.preventDefault(); navigate(ENUMFORROUTES.SETTINGS); setIsUserMenuOpen(false); }} className="user-dropdown-item">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  Profile
                </a>
                <div className="user-dropdown-divider"></div>
                <button className="user-dropdown-item logout" onClick={handleLogout}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="dashboard-content">
        {/* Course Filter Pills */}
        <div className="course-filters">
          {!isEmptyObjectOrNullUndefiend(syllabusDropDownData) &&
            syllabusDropDownData?.map((item: any, index: number) => {
              const courseColorHex = item?.course_color || item?.other?.course_color || '#239BC2';
              const colorClass = getColorClassName(courseColorHex);
              const pillId = normalizeId(getCourseIdFromPillItem(item));
              const isActive = activeCourseIds === null ? true : (pillId ? activeCourseIds.includes(pillId) : true);
              return (
                <button
                  type="button"
                  className={`course-pill ${colorClass} ${isActive ? 'active' : ''}`}
                  key={index}
                  onClick={() => toggleCourseActive(item)}
                  aria-pressed={isActive}
                  style={
                    isActive
                      ? {
                          borderColor: courseColorHex,
                          backgroundColor: hexToRgba(courseColorHex, 0.12) || undefined,
                        }
                      : undefined
                  }
                >
                  <span className="pill-dot" style={{ backgroundColor: courseColorHex }}></span>
                  {item?.label}
                </button>
              );
            })}
        </div>

        {/* Tasks Table */}
        {!isEmptyObjectOrNullUndefiend(eventData) && eventData.length > 0 ? (
          <div className="tasks-container">
            {/* Table Header */}
            <div className="tasks-table-header">
              <div className="col-actions">DONE</div>
              <div className="col-time">Time</div>
              <div className="col-priority">Priority</div>
              <div className="col-course">Course Name</div>
              <div className="col-event">Event Name</div>
              <div className="col-delete">DELETE</div>
            </div>

            {/* Dynamic Events Container */}
            <div id="dashboardEventsContainer">
              {eventData?.map((group: any, groupIndex: number) => {
                const filterOn = activeCourseIds !== null;
                const highlightOn = filterOn && Array.isArray(activeCourseIds) && activeCourseIds.length !== allCourseIds.length;
                const groupEvents: any[] = Array.isArray(group?.eventData) ? group.eventData : [];
                const filteredEvents = filterOn
                  ? groupEvents.filter((event) => {
                      const eventCourseId = normalizeId(getCourseIdFromEvent(event));
                      // If event isn't tied to a course, keep showing it
                      if (!eventCourseId) return true;
                      // If no pills are active, hide course-tied events
                      if (!activeCourseIds || activeCourseIds.length === 0) return false;
                      return activeCourseIds.includes(eventCourseId);
                    })
                  : groupEvents;

                // If a course is selected, hide date sections with no matching events
                if (filterOn && filteredEvents.length === 0) return null;

                // Use the first event's start_date for the header (more reliable than group.due_date)
                const firstEvent = filteredEvents[0];
                const displayDate = firstEvent?.start_date || group?.due_date;

                return (
                <React.Fragment key={groupIndex}>
                  {/* Due Date Header */}
                  <div className="due-date-header">
                    Due on{' '}
                    {!isNullUndefinedOrBlank(displayDate)
                      ? formatedDate(displayDate, 'dddd, MMM DD')
                      : '-'}
                  </div>

                  {/* Event Rows */}
                    {filteredEvents.map((event: any, eventIndex: number) => {
                      const highlightColor =
                        event?.course_color || event?.syllabus?.course_color || event?.syllabus?.courseColor;
                      const hoverBg = highlightColor ? hexToRgba(String(highlightColor), 0.12) : null;

                      return (
                    <div
                      key={eventIndex}
                      className={`task-row clickable-event ${
                            highlightOn ? 'course-highlight-match' : ''
                          } ${event?.status === ENUMFORSTATUS.COMPLETED ? 'completed' : ''}`}
                          style={{
                            ...(highlightColor ? ({ ['--row-course-color' as any]: highlightColor } as any) : undefined),
                            ...(hoverBg ? ({ ['--row-course-hover-bg' as any]: hoverBg } as any) : undefined),
                            ...(highlightOn && highlightColor ? ({ ['--active-course-color' as any]: highlightColor } as any) : undefined),
                          }}
                      onClick={() => handleSelectEvent(event)}
                    >
                      <div className="col-actions">
                        <button
                          className={`task-checkbox ${event?.status === ENUMFORSTATUS.COMPLETED ? 'checked' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEventCompleted([event?.id], event?.status);
                          }}
                          type="button"
                          aria-label={event?.status === ENUMFORSTATUS.COMPLETED ? 'Mark as incomplete' : 'Mark as complete'}
                        >
                          <svg className="check-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </button>
                      </div>

                      <div className="col-time">
                        <span
                          className="time-indicator"
                          style={{ background: event?.course_color || event?.syllabus?.course_color }}
                        ></span>
                        {formatedDate(event?.start_date, 'hh:mm A')} -{' '}
                        {formatedDate(event?.end_date, 'hh:mm A')}
                      </div>

                      <div className={`col-priority priority-badge ${getPriorityColour(event?.priority)}`}>
                        {event?.priority}
                      </div>

                      <div className="col-course">{event?.syllabus?.title}</div>

                      <div className="col-event">{event?.title}</div>

                      <div className="col-delete">
                        <button
                          className="action-btn delete-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteShow([event]);
                          }}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            <line x1="10" y1="11" x2="10" y2="17" />
                            <line x1="14" y1="11" x2="14" y2="17" />
                          </svg>
                        </button>
                      </div>
                    </div>
                      );
                    })}
                </React.Fragment>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="tasks-container">
            {/* Table Header (show even in empty state) */}
            <div className="tasks-table-header">
              <div className="col-actions">DONE</div>
              <div className="col-time">Time</div>
              <div className="col-priority">Priority</div>
              <div className="col-course">Course Name</div>
              <div className="col-event">Event Name</div>
              <div className="col-delete">DELETE</div>
            </div>

            {/* Empty state: show an "Add event" row instead of plain text */}
            <div className="add-event-row" role="button" tabIndex={0} onClick={handleShow}>
              <button
                className="add-event-circle"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleShow();
                }}
                aria-label="Add event"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
              <span className="add-event-input" style={{ color: 'var(--neutral-400)', pointerEvents: 'none' }}>
                Add event
              </span>
            </div>
          </div>
        )}
      </div>

      <ConfirmDeleteModal
        show={deleteShow}
        onClose={handleDeleteClose}
        onConfirm={handleDeleteData}
        message={<>Are you sure you want to delete this? This action cannot be undone.</>}
        cancelText="Cancel"
        confirmText="Delete"
      />

      {/* Add/Edit Event Modal */}
      <AddEditEvent
        show={show}
        setShow={setShow}
        handleGetData={handleGetUpdatedData}
        setEditEventFormData={setEditEventFormData}
        editEventFormData={editEventFormData}
      />

      {/* Add/Edit Syllabus Modal */}
      <AddEditSyllabus
        showSyllabus={showSyllabus}
        setShowSyllabus={setShowSyllabus}
        handleGetData={handleGetUpdatedData}
        freemiumLimitReached={freemiumLimitReached}
        hasSubscription={hasSubscription}
        isFreemiumPlan={isFreemiumPlan}
        onReferralClick={handleReferralClick}
        onUpgradeClick={() => navigate(ENUMFORROUTES.PLAN_DETAILS)}
        upgradeRequired={upgradeRequired}
        existingSyllabusCount={syllabusDropDownData.length}
      />

      <ReferralUnlockModal
        show={showReferralModal}
        onClose={() => setShowReferralModal(false)}
        referralLink={referralLink}
        referralSentCount={referralSentCount}
        existingSyllabusCount={syllabusDropDownData.length}
        onReferralSent={markReferralSent}
      />

      {showAppPromo ? (
        <div className="dashboard-app-promo" role="dialog" aria-live="polite">
          <div className="dashboard-app-promo-content">
            <div className="dashboard-app-promo-text">
              <p className="dashboard-app-promo-title">Check out the Open Planner app</p>
              <p className="dashboard-app-promo-subtitle">Get reminders and manage assignments on the go.</p>
            </div>
            <a
              className="dashboard-app-promo-link"
              href="https://apps.apple.com/us/app/open-planner/id6615063437"
              target="_blank"
              rel="noreferrer"
            >
              View in App Store
            </a>
          </div>
          <button
            type="button"
            className="dashboard-app-promo-dismiss"
            onClick={handleDismissAppPromo}
            aria-label="Dismiss app promo"
          >
            Dismiss
          </button>
        </div>
      ) : null}
    </>
  );
};

export default Dashboard;
