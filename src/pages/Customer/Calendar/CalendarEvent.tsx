import React, { useEffect, useMemo, useState, useRef } from 'react';
import { AppDispatch, RootState } from '../../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import {
  getCalenderDataAPI,
  getSyllabusDropDownDataAPI,
} from '../../../redux/Service/User/Calender/calender';
import {
  deleteEventDataAPI,
} from '../../../redux/Service/User/Courses/courses';
import {
  formatedDate,
  isNullUndefinedOrBlank,
  customJsonInclude,
} from '../../../Utility/Helper';
import { ENUMFORROUTES, ENUMFORSTATUS } from '../../../interfaces/enum';
import { ENUM_FOR_EVENT_PRIORITY } from '../../../interfaces/enum';
import { useNavigate } from 'react-router-dom';
import { logoutFromSystem } from '../../../redux/Service/auth/login';
import { getUserAPI } from '../../../redux/Service/User/Settings/settings';
import { useSidebar } from '../../../layouts/DashboardLayout';
import { useNotificationPanel } from '../../../components/Notifications/NotificationPanelContext';
import AddEditEvent from '../../../common/AddSyllabusEvents/AddEditEvent';
import AddEditSyllabus from '../../../common/AddSyllabusEvents/AddEditSyllabus';
import ConfirmDeleteModal from '../../../components/ConfirmDeleteModal/ConfirmDeleteModal';
import { isUpdatedSyllabus } from '../../../redux/User/Courses/coursesSlice';
import moment from 'moment';

const CalendarEvent = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { toggleSidebar } = useSidebar();
  const { open: openNotifications, unreadCount } = useNotificationPanel();

  const settingsData: any = useSelector((state: RootState) => state.SettingsReducer);
  const coursesData: any = useSelector((state: RootState) => state.CoursesReducer);

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const [currentDate, setCurrentDate] = useState(moment());
  const [miniCalendarDate, setMiniCalendarDate] = useState(moment());
  const [selectedDate, setSelectedDate] = useState(moment());
  const [currentView, setCurrentView] = useState<'month' | 'week' | 'day'>('month');
  const [calendarEvents, setCalendarEvents] = useState<any[]>([]);
  const [selectedClasses, setSelectedClasses] = useState<number[]>([]);
  const [syllabusDropDownData, setSyllabusDropDownData] = useState<any>([]);
  const [loadingDropdown, setLoadingDropdown] = useState<boolean>(true);
  const [loadingEvents, setLoadingEvents] = useState<boolean>(false);
  const [hasLoadedEventsOnce, setHasLoadedEventsOnce] = useState<boolean>(false);

  const [show, setShow] = useState(false);
  const [showSyllabus, setShowSyllabus] = useState(false);
  const [editEventFormData, setEditEventFormData] = useState<any>(null);
  const [deleteShow, setDeleteShow] = useState(false);
  const [deleteEventData, setDeleteEventData] = useState<any>(null);

  const handleGetDropDownData = async () => {
    setLoadingDropdown(true);
    try {
    const response = await dispatch(getSyllabusDropDownDataAPI());
    if (response && !isNullUndefinedOrBlank(response?.payload)) {
      setSyllabusDropDownData(response?.payload);
      const syllabusIds = response?.payload?.map((item: any) => item.value);
      setSelectedClasses(syllabusIds);
      } else {
        setSyllabusDropDownData([]);
        setSelectedClasses([]);
      }
    } finally {
      setLoadingDropdown(false);
    }
  };

  const handleGetCalendarData = async () => {
    setLoadingEvents(true);
    try {
    const reqBody: any = { syllabus_id: selectedClasses };
    customJsonInclude(reqBody);
    const response = await dispatch(getCalenderDataAPI(reqBody));
    if (response && !isNullUndefinedOrBlank(response?.payload)) {
      setCalendarEvents(response?.payload || []);
    } else {
      setCalendarEvents([]);
      }
    } finally {
      setLoadingEvents(false);
      setHasLoadedEventsOnce(true);
    }
  };

  useEffect(() => {
    handleGetDropDownData();
  }, []);

  useEffect(() => {
    if (selectedClasses.length > 0) {
      handleGetCalendarData();
    }
  }, [selectedClasses]);

  useEffect(() => {
    if (coursesData.isUpdatedEventData) {
      handleGetCalendarData();
    }
  }, [coursesData.isUpdatedEventData]);

  useEffect(() => {
    if (coursesData.isUpdatedSyllabusData) {
      handleGetDropDownData();
      // Reset flag so future uploads trigger refresh again
      setTimeout(() => {
        try {
          dispatch(isUpdatedSyllabus(false));
        } catch {}
      }, 250);
    }
  }, [coursesData.isUpdatedSyllabusData]);

  const handleToday = () => {
    const now = moment();
    setCurrentDate(now);
    setMiniCalendarDate(now);
    setSelectedDate(now);
  };

  const getHeaderLabel = () => {
    const base = moment(selectedDate || currentDate);
    if (currentView === 'day') return base.format('MMMM D, YYYY');
    if (currentView === 'week') {
      const start = base.clone().startOf('week');
      const end = base.clone().endOf('week');
      // Example: Dec 14 - Dec 20, 2025
      return `${start.format('MMM D')} - ${end.format('MMM D, YYYY')}`;
    }
    return moment(currentDate).format('MMMM YYYY');
  };

  const syncFocusDate = (next: moment.Moment) => {
    setSelectedDate(next);
    setCurrentDate(next);
    setMiniCalendarDate(next);
  };

  const handlePrevious = () => {
    const base = moment(selectedDate || currentDate);
    const unit: moment.unitOfTime.DurationConstructor =
      currentView === 'day' ? 'day' : currentView === 'week' ? 'week' : 'month';
    syncFocusDate(base.clone().subtract(1, unit));
  };

  const handleNext = () => {
    const base = moment(selectedDate || currentDate);
    const unit: moment.unitOfTime.DurationConstructor =
      currentView === 'day' ? 'day' : currentView === 'week' ? 'week' : 'month';
    syncFocusDate(base.clone().add(1, unit));
  };

  const handleMiniPrevious = () => {
    setMiniCalendarDate(moment(miniCalendarDate).subtract(1, 'month'));
  };

  const handleMiniNext = () => {
    setMiniCalendarDate(moment(miniCalendarDate).add(1, 'month'));
  };

  useEffect(() => {
    // When switching views, keep the main navigation synced to the selected date.
    setCurrentDate(moment(selectedDate));
  }, [currentView]); // eslint-disable-line react-hooks/exhaustive-deps

  const getMiniCalendarDays = (): moment.Moment[] => {
    const start = moment(miniCalendarDate).startOf('month').startOf('week');
    const end = moment(miniCalendarDate).endOf('month').endOf('week');
    const days: moment.Moment[] = [];
    const day = start.clone();

    while (day.isBefore(end)) {
      days.push(day.clone());
      day.add(1, 'day');
    }
    return days;
  };

  const getCalendarDays = (): moment.Moment[] => {
    const start = moment(currentDate).startOf('month').startOf('week');
    const end = moment(currentDate).endOf('month').endOf('week');
    const days: moment.Moment[] = [];
    const day = start.clone();

    while (day.isBefore(end)) {
      days.push(day.clone());
      day.add(1, 'day');
    }
    return days;
  };

  const parseEventDate = (value: any): Date | null => {
    if (!value) return null;
    if (value instanceof Date) return value;
    if (typeof value === 'number') return new Date(value);
    if (typeof value === 'string') {
      // ISO? let Date parse it.
      if (value.includes('T')) {
        const d = new Date(value);
        return Number.isNaN(d.getTime()) ? null : d;
      }
      // Common backend formats
      const m = moment.utc(value, ['YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD'], true);
      if (m.isValid()) return m.toDate();
      const fallback = new Date(value);
      return Number.isNaN(fallback.getTime()) ? null : fallback;
    }
    return null;
  };

  type NormalizedCalendarEvent = {
    id?: string | number;
    title: string;
    start: Date;
    end: Date;
    status?: string;
    priority?: string;
    courseColor?: string;
    raw: any;
  };

  const normalizedEvents: NormalizedCalendarEvent[] = useMemo(() => {
    return (calendarEvents || [])
      .map((ev: any) => {
        const raw = ev;
        const eventData = ev?.event_data ?? ev;
        const title =
          eventData?.title ??
          ev?.title ??
          eventData?.name ??
          'Event';

        const startVal = ev?.start ?? eventData?.start_date ?? eventData?.startDate;
        const endVal = ev?.end ?? eventData?.end_date ?? eventData?.endDate;
        const start = parseEventDate(startVal);
        const end = parseEventDate(endVal) ?? start;

        if (!start) return null;

        const courseColor =
          eventData?.course_color ??
          ev?.course_color ??
          eventData?.courseColor ??
          ev?.courseColor;

        return {
          id: eventData?.id ?? ev?.id,
          title,
          start,
          end,
          status: eventData?.status ?? ev?.status,
          priority: eventData?.priority ?? ev?.priority,
          courseColor,
          raw,
        } as NormalizedCalendarEvent;
      })
      .filter(Boolean) as NormalizedCalendarEvent[];
  }, [calendarEvents]);

  const getEventsForDay = (date: moment.Moment) => {
    const dayKey = date.format('YYYY-MM-DD');
    return normalizedEvents.filter((event) => moment(event.start).format('YYYY-MM-DD') === dayKey);
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

  const handleToggleClass = (classId: number) => {
    if (selectedClasses.includes(classId)) {
      setSelectedClasses(selectedClasses.filter((id) => id !== classId));
    } else {
      setSelectedClasses([...selectedClasses, classId]);
    }
  };

  const handleShow = () => {
    setEditEventFormData(null);
    setShow(true);
  };

  const handleEventClick = (event: any) => {
    setEditEventFormData({
      ...event.event_data,
      start_date: new Date(formatedDate(event.event_data.start_date, 'yyyy-MM-DD HH:mm:ss')),
      end_date: new Date(formatedDate(event.event_data.end_date, 'yyyy-MM-DD HH:mm:ss')),
    });
    setShow(true);
  };

  const handleCreateEventForDay = (day: moment.Moment) => {
    const start = day.clone().hour(9).minute(0).second(0).millisecond(0);
    const end = start.clone().add(30, 'minutes');
    setEditEventFormData({
      id: null,
      title: '',
      note: '',
      start_date: start.toDate(),
      end_date: end.toDate(),
      is_reminder: false,
      reminder: [],
      priority: ENUM_FOR_EVENT_PRIORITY?.LOW || 'Low',
      is_all_day_event: false,
    });
    setShow(true);
  };

  const { hasSubscription, isFreemiumPlan } = (() => {
    try {
      const tier = localStorage.getItem('plan_tier');
      const subscriptionFlag = localStorage.getItem('has_subscription') === 'true';
      return {
        hasSubscription: subscriptionFlag,
        isFreemiumPlan: tier === 'freemium',
      };
    } catch {
      return {
        hasSubscription: false,
        isFreemiumPlan: false,
      };
    }
  })();

  const FREEMIUM_UPLOAD_LIMIT = 3;
  const freemiumLimitReached =
    isFreemiumPlan && !hasSubscription && syllabusDropDownData.length >= FREEMIUM_UPLOAD_LIMIT;

  const handleUpgradeClick = () => {
    navigate(ENUMFORROUTES.PLAN_DETAILS);
  };

  const handleAddSyllabusClick = () => {
    if (freemiumLimitReached) {
      handleUpgradeClick();
      return;
    }
    setShowSyllabus(true);
  };

  const handleDeleteClose = () => {
    setDeleteShow(false);
    setDeleteEventData(null);
  };

  const handleDeleteConfirm = async () => {
    if (deleteEventData) {
      const response = await dispatch(
        deleteEventDataAPI({ event_id: [deleteEventData.event_data.id] })
      );
      if (response && !isNullUndefinedOrBlank(response?.payload)) {
        handleDeleteClose();
        handleGetCalendarData();
      }
    }
  };

  const handleUserMenuToggle = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleLogout = async () => {
    await dispatch(logoutFromSystem());
    navigate(ENUMFORROUTES.LOGIN);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const response = await dispatch(getUserAPI());
      if (response && !isNullUndefinedOrBlank(response?.payload)) {
        setUserData(response.payload);
      }
    };
    fetchUserData();
  }, [dispatch]);

  useEffect(() => {
    if (!isNullUndefinedOrBlank(settingsData?.userData)) {
      setUserData(settingsData.userData);
    }
  }, [settingsData?.userData]);

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

  const renderCalendarWeeks = () => {
    const days = getCalendarDays();
    const weeks: moment.Moment[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }

    return weeks.map((week, weekIndex) => (
      <div className="calendar-week" key={weekIndex}>
        {week.map((day, dayIndex) => {
          const eventsForDay = getEventsForDay(day);
          const isOtherMonth = !day.isSame(currentDate, 'month');
          const isToday = day.isSame(moment(), 'day');
          const isSelected = day.isSame(selectedDate, 'day');

          return (
            <div
              className={`calendar-cell ${isOtherMonth ? 'other-month' : ''} ${isToday ? 'today' : ''} ${
                isSelected ? 'selected' : ''
              }`}
              key={dayIndex}
              onClick={() => {
                setSelectedDate(day.clone());
                if (eventsForDay.length === 0) {
                  handleCreateEventForDay(day);
                }
              }}
            >
              <span className="cell-date">{day.date()}</span>
              <div className="cell-events">
                {eventsForDay.slice(0, 3).map((event: any, eventIndex: number) => {
                  const colorClass = getColorClassName(event.courseColor || '#239BC2');
                  return (
                    <div
                      key={eventIndex}
                      className={`event-chip ${colorClass}`}
                      role="button"
                      tabIndex={0}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEventClick(event.raw);
                      }}
                    >
                      {event.title}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    ));
  };

  const isCompletedStatus = (status?: string) => {
    if (!status) return false;
    return String(status).toLowerCase() === String(ENUMFORSTATUS.COMPLETED).toLowerCase() || String(status).toLowerCase() === 'completed';
  };

  const isHighPriority = (priority?: string) => String(priority).toLowerCase() === 'high';

  const getWeekDays = () => {
    const start = moment(selectedDate).startOf('week');
    return Array.from({ length: 7 }, (_, i) => start.clone().add(i, 'day'));
  };

  const getWeekEventsForDay = (day: moment.Moment) => {
    const dayStart = day.clone().startOf('day');
    const dayEnd = day.clone().endOf('day');
    return normalizedEvents.filter((ev) => {
      const start = moment(ev.start);
      const end = moment(ev.end);
      // overlap check: start < dayEnd && end > dayStart
      return start.isBefore(dayEnd) && end.isAfter(dayStart);
    });
  };

  const layoutDayEvents = (day: moment.Moment, events: NormalizedCalendarEvent[]) => {
    const dayStart = day.clone().startOf('day');
    const toMin = (d: Date) => Math.max(0, Math.min(24 * 60, moment(d).diff(dayStart, 'minutes')));

    const items = events
      .map((ev) => {
        const startMin = toMin(ev.start);
        const endMin = Math.max(startMin + 5, toMin(ev.end)); // ensure visible
        return { ev, startMin, endMin };
      })
      .sort((a, b) => (a.startMin - b.startMin) || (a.endMin - b.endMin));

    // simple greedy column assignment
    const colEnds: number[] = [];
    const assigned = items.map((it) => {
      let col = colEnds.findIndex((end) => it.startMin >= end);
      if (col === -1) {
        col = colEnds.length;
        colEnds.push(it.endMin);
      } else {
        colEnds[col] = it.endMin;
      }
      return { ...it, col };
    });

    const totalCols = Math.max(1, colEnds.length);
    return assigned.map((it) => {
      const widthPct = 100 / totalCols;
      return {
        ...it,
        leftPct: it.col * widthPct,
        widthPct,
      };
    });
  };

  return (
    <>
      <header className="dashboard-header">
        <div className="dashboard-header-inner">
          <div className="dashboard-header-left">
            <button className="mobile-menu-toggle" onClick={toggleSidebar}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>

            <h1 className="dashboard-page-title">Calendar</h1>
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

      <div className="calendar-page">
        <aside className="calendar-sidebar">
          <div className="mini-calendar">
            <div className="mini-calendar-header">
              <button className="mini-nav-btn prev" onClick={handleMiniPrevious}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <span className="mini-calendar-title">{miniCalendarDate.format('MMMM YYYY')}</span>
              <button className="mini-nav-btn next" onClick={handleMiniNext}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
            <div className="mini-calendar-grid">
              <div className="mini-day-header">Su</div>
              <div className="mini-day-header">Mo</div>
              <div className="mini-day-header">Tu</div>
              <div className="mini-day-header">We</div>
              <div className="mini-day-header">Th</div>
              <div className="mini-day-header">Fr</div>
              <div className="mini-day-header">Sa</div>

              {getMiniCalendarDays().map((day, index) => {
                const isOtherMonth = !day.isSame(miniCalendarDate, 'month');
                const isToday = day.isSame(moment(), 'day');
                const isSelected = day.isSame(selectedDate, 'day');
                return (
                  <div
                    key={index}
                    className={`mini-day ${isOtherMonth ? 'other-month' : ''} ${isToday ? 'today' : ''} ${
                      isSelected ? 'selected' : ''
                    }`}
                    onClick={() => {
                      setCurrentDate(day.clone());
                      setMiniCalendarDate(day.clone());
                      setSelectedDate(day.clone());
                    }}
                  >
                    {day.date()}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="my-classes">
            <div className="my-classes-header">
              <h3>My Classes</h3>
              <span className="class-count">
                {syllabusDropDownData.length} {syllabusDropDownData.length === 1 ? 'Class' : 'Classes'}
              </span>
            </div>
            <div className="class-list">
              {loadingDropdown ? (
                <div style={{ padding: '0.75rem 0.25rem', color: 'var(--neutral-500)', fontSize: 14 }}>
                  Loading classes…
                </div>
              ) : syllabusDropDownData.length === 0 ? (
                <div style={{ padding: '0.75rem 0.25rem', color: 'var(--neutral-500)', fontSize: 14 }}>
                  No classes yet.
                </div>
              ) : (
                syllabusDropDownData.map((item: any) => {
                  const courseColorHex = item?.course_color || item?.other?.course_color || '#239BC2';
                  const colorClass = getColorClassName(courseColorHex);
                  const isChecked = selectedClasses.includes(item.value);
                return (
                  <label className="class-item" key={item.value}>
                    <input
                      type="checkbox"
                        checked={isChecked}
                      onChange={() => handleToggleClass(item.value)}
                    />
                      <span
                        className={`checkmark ${colorClass} ${isChecked ? 'checked' : ''}`}
                        style={{
                          borderColor: courseColorHex,
                          background: isChecked ? courseColorHex : '#fff',
                          color: isChecked ? '#fff' : courseColorHex,
                        }}
                      ></span>
                    <span className="class-name">{item.label}</span>
                  </label>
                );
                })
              )}
            </div>
          </div>
        </aside>

        <div className="calendar-main">
          {(loadingDropdown || loadingEvents) && (
            <div className="loader-container inline-loader" style={{ background: 'rgba(255, 255, 255, 0.72)' }}>
              <svg className="inner-container" viewBox="0 0 35 35" height="35" width="35">
                <rect className="track" x="2.5" y="2.5" fill="none" strokeWidth="5px" width="32.5" height="32.5" />
                <rect className="car" x="2.5" y="2.5" fill="none" strokeWidth="5px" width="32.5" height="32.5" pathLength="100" />
              </svg>
            </div>
          )}

          <div className="calendar-controls">
            <div className="view-toggles">
              <button className="view-btn" onClick={handleToday}>
                Today
              </button>
              <button
                className={`view-btn ${currentView === 'month' ? 'active' : ''}`}
                onClick={() => setCurrentView('month')}
              >
                Month
              </button>
              <button
                className={`view-btn ${currentView === 'week' ? 'active' : ''}`}
                onClick={() => setCurrentView('week')}
              >
                Week
              </button>
              <button
                className={`view-btn ${currentView === 'day' ? 'active' : ''}`}
                onClick={() => setCurrentView('day')}
              >
                Day
              </button>
            </div>

            <div className="calendar-navigation">
              <button className="cal-nav-btn prev" onClick={handlePrevious}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <h2 className="current-month">{getHeaderLabel()}</h2>
              <button className="cal-nav-btn next" onClick={handleNext}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </div>

          {currentView === 'month' && (
            <div className="calendar-grid">
              {!loadingDropdown &&
                !loadingEvents &&
                hasLoadedEventsOnce &&
                selectedClasses.length > 0 &&
                calendarEvents.length === 0 && (
                  <div className="calendar-empty-overlay">
                    <div className="calendar-empty-card">
                      <div className="calendar-empty-title">No events found</div>
                      <p className="calendar-empty-text">
                        There aren’t any events for the selected classes in this view.
                      </p>
                    </div>
                  </div>
                )}
              <div className="calendar-header-row">
                <div className="calendar-day-header">Sun</div>
                <div className="calendar-day-header">Mon</div>
                <div className="calendar-day-header">Tue</div>
                <div className="calendar-day-header">Wed</div>
                <div className="calendar-day-header">Thu</div>
                <div className="calendar-day-header">Fri</div>
                <div className="calendar-day-header">Sat</div>
              </div>

              <div className="calendar-body">{renderCalendarWeeks()}</div>
            </div>
          )}

          {currentView === 'week' && (
            <div className="week-view">
              {(() => {
                const days = getWeekDays();
                const isThisWeek = moment().isSame(moment(selectedDate).startOf('week'), 'week');
                const now = moment();
                const nowDayIdx = isThisWeek ? now.diff(moment(selectedDate).startOf('week'), 'days') : -1;
                const nowMin = now.hours() * 60 + now.minutes();

                const hours = Array.from({ length: 24 }, (_, i) => i);

                return (
                  <>
                    <div className="week-view-header">
                      <div className="week-time-column" />
                      {days.map((d) => {
                        const isToday = d.isSame(moment(), 'day');
                        return (
                          <div
                            key={d.format('YYYY-MM-DD')}
                            className="week-day-column"
                            role="button"
                            tabIndex={0}
                            onClick={() => setSelectedDate(d.clone())}
                          >
                            <div className="week-day-name">{d.format('ddd')}</div>
                            <div className={`week-day-date ${isToday ? 'today' : ''}`}>{d.date()}</div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="week-view-body">
                      <div className="week-time-slots">
                        {hours.map((h) => (
                          <div className="time-slot-row" key={h}>
                            <div className="time-label">{moment().hour(h).minute(0).format('h A')}</div>
                            {days.map((d) => (
                              <div className="time-slot" key={`${d.format('YYYY-MM-DD')}-${h}`} />
                            ))}
                          </div>
                        ))}

                        <div className="week-events-container">
                          {days.map((d, dayIdx) => {
                            const dayEvents = getWeekEventsForDay(d);
                            const positioned = layoutDayEvents(d, dayEvents);
                            return (
                              <div className="week-day-events" key={d.format('YYYY-MM-DD')}>
                                {dayIdx === nowDayIdx ? (
                                  <div
                                    className="current-time-indicator"
                                    style={{ top: `${nowMin}px` }}
                                    aria-hidden
                                  />
                                ) : null}

                                {positioned.map(({ ev, startMin, endMin, leftPct, widthPct }, idx) => {
                                  const colorClass = getColorClassName(ev.courseColor || '#239BC2');
                                  const completed = isCompletedStatus(ev.status);
                                  const high = isHighPriority(ev.priority);
                                  const height = Math.max(22, endMin - startMin);
                                  const startStr = moment(ev.start).format('h:mm A');
                                  const endStr = moment(ev.end).format('h:mm A');

                                  return (
                                    <div
                                      key={`${String(ev.id ?? idx)}-${startMin}-${endMin}`}
                                      className={`week-event ${colorClass} ${completed ? 'completed' : ''}`}
                                      style={{
                                        top: `${startMin}px`,
                                        height: `${height}px`,
                                        left: `calc(${leftPct}% + 2px)`,
                                        width: `calc(${widthPct}% - 4px)`,
                                      }}
                                      role="button"
                                      tabIndex={0}
                                      onClick={() => handleEventClick(ev.raw)}
                                    >
                                      {high ? <span className="priority-indicator high" title="High priority" /> : null}
                                      <span className="week-event-title">{ev.title}</span>
                                      <span className="week-event-time">{startStr} - {endStr}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          )}

          {currentView === 'day' && (
            <div className="day-view">
              {(() => {
                const day = moment(selectedDate);
                const isToday = day.isSame(moment(), 'day');
                const now = moment();
                const nowMin = now.hours() * 60 + now.minutes();

                const hours = Array.from({ length: 24 }, (_, i) => i);
                const ROW_HEIGHT = 70; // matches .day-time-row height in calendar.css
                const pxPerMin = ROW_HEIGHT / 60;

                const dayEvents = getWeekEventsForDay(day);
                const positioned = layoutDayEvents(day, dayEvents);

                return (
                  <>
                    <div className="day-view-header">
                      <div className="day-view-date">
                        <div className="day-view-weekday">{day.format('ddd')}</div>
                        <div className={`day-view-number ${isToday ? 'today' : ''}`}>{day.date()}</div>
                        <div className="day-view-month">{day.format('MMMM YYYY')}</div>
                      </div>
                    </div>

                    <div className="day-view-body">
                      <div className="day-time-slots">
                        {hours.map((h) => (
                          <div className="day-time-row" key={h}>
                            <div className="day-time-label">{moment().hour(h).minute(0).format('h A')}</div>
                            <div className="day-time-content" />
                          </div>
                        ))}

                        <div className="day-events-container">
                          {isToday ? (
                            <div
                              className="current-time-indicator"
                              style={{ top: `${nowMin * pxPerMin}px` }}
                              aria-hidden
                            />
                          ) : null}

                          {positioned.map(({ ev, startMin, endMin, leftPct, widthPct }, idx) => {
                            const colorClass = getColorClassName(ev.courseColor || '#239BC2');
                            const completed = isCompletedStatus(ev.status);
                            const high = isHighPriority(ev.priority);
                            const height = Math.max(26, (endMin - startMin) * pxPerMin);
                            const top = startMin * pxPerMin;
                            const startStr = moment(ev.start).format('h:mm A');
                            const endStr = moment(ev.end).format('h:mm A');

                            return (
                              <div
                                key={`${String(ev.id ?? idx)}-${startMin}-${endMin}`}
                                className={`day-event ${colorClass} ${completed ? 'completed' : ''}`}
                                style={{
                                  top: `${top}px`,
                                  height: `${height}px`,
                                  left: `calc(${leftPct}% + 8px)`,
                                  width: `calc(${widthPct}% - 16px)`,
                                }}
                                role="button"
                                tabIndex={0}
                                onClick={() => handleEventClick(ev.raw)}
                              >
                                {high ? <span className="priority-indicator high" title="High priority" /> : null}
                                <div className="day-event-time">{startStr} - {endStr}</div>
                                <div className="day-event-title">{ev.title}</div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          )}
        </div>
      </div>

      <ConfirmDeleteModal
        show={deleteShow}
        onClose={handleDeleteClose}
        onConfirm={handleDeleteConfirm}
        message={<>Are you sure you want to delete this? This action cannot be undone.</>}
        cancelText="Cancel"
        confirmText="Delete"
      />

      <AddEditEvent
        show={show}
        setShow={setShow}
        handleGetData={handleGetCalendarData}
        setEditEventFormData={setEditEventFormData}
        editEventFormData={editEventFormData}
      />

      <AddEditSyllabus
        showSyllabus={showSyllabus}
        setShowSyllabus={setShowSyllabus}
        handleGetData={handleGetDropDownData}
        freemiumLimitReached={freemiumLimitReached}
        hasSubscription={hasSubscription}
        isFreemiumPlan={isFreemiumPlan}
        onUpgradeClick={handleUpgradeClick}
        existingSyllabusCount={syllabusDropDownData.length}
      />
    </>
  );
};

export default CalendarEvent;
