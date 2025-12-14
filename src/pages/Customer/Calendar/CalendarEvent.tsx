import React, { useEffect, useState, useRef } from 'react';
import { AppDispatch, RootState } from '../../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import {
  getCalenderDataAPI,
  getSyllabusDropDownDataAPI,
} from '../../../redux/Service/User/Calender/calender';
import {
  deleteEventDataAPI,
  updateEventStatusDataAPI,
} from '../../../redux/Service/User/Courses/courses';
import {
  formatedDate,
  isEmptyObjectOrNullUndefiend,
  isNullUndefinedOrBlank,
  customJsonInclude,
} from '../../../Utility/Helper';
import { ENUMFORROUTES, ENUMFORSTATUS } from '../../../interfaces/enum';
import { useNavigate } from 'react-router-dom';
import { logoutFromSystem } from '../../../redux/Service/auth/login';
import { getUserAPI } from '../../../redux/Service/User/Settings/settings';
import { useSidebar } from '../../../layouts/DashboardLayout';
import AddEditEvent from '../../../common/AddSyllabusEvents/AddEditEvent';
import AddEditSyllabus from '../../../common/AddSyllabusEvents/AddEditSyllabus';
import moment from 'moment';

const CalendarEvent = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { toggleSidebar } = useSidebar();

  const settingsData: any = useSelector((state: RootState) => state.SettingsReducer);
  const coursesData: any = useSelector((state: RootState) => state.CoursesReducer);

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const [currentDate, setCurrentDate] = useState(moment());
  const [miniCalendarDate, setMiniCalendarDate] = useState(moment());
  const [currentView, setCurrentView] = useState<'month' | 'week' | 'day'>('month');
  const [calendarEvents, setCalendarEvents] = useState<any[]>([]);
  const [selectedClasses, setSelectedClasses] = useState<number[]>([]);
  const [syllabusDropDownData, setSyllabusDropDownData] = useState<any>([]);

  const [show, setShow] = useState(false);
  const [showSyllabus, setShowSyllabus] = useState(false);
  const [editEventFormData, setEditEventFormData] = useState<any>(null);
  const [deleteShow, setDeleteShow] = useState(false);
  const [deleteEventData, setDeleteEventData] = useState<any>(null);

  const handleGetDropDownData = async () => {
    const response = await dispatch(getSyllabusDropDownDataAPI());
    if (response && !isNullUndefinedOrBlank(response?.payload)) {
      setSyllabusDropDownData(response?.payload);
      const syllabusIds = response?.payload?.map((item: any) => item.value);
      setSelectedClasses(syllabusIds);
    }
  };

  const handleGetCalendarData = async () => {
    const reqBody: any = { syllabus_id: selectedClasses };
    customJsonInclude(reqBody);
    const response = await dispatch(getCalenderDataAPI(reqBody));
    if (response && !isNullUndefinedOrBlank(response?.payload)) {
      setCalendarEvents(response?.payload || []);
    } else {
      setCalendarEvents([]);
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
    }
  }, [coursesData.isUpdatedSyllabusData]);

  const handleToday = () => {
    setCurrentDate(moment());
    setMiniCalendarDate(moment());
  };

  const handlePrevious = () => {
    const newDate = moment(currentDate).subtract(1, 'month');
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = moment(currentDate).add(1, 'month');
    setCurrentDate(newDate);
  };

  const handleMiniPrevious = () => {
    setMiniCalendarDate(moment(miniCalendarDate).subtract(1, 'month'));
  };

  const handleMiniNext = () => {
    setMiniCalendarDate(moment(miniCalendarDate).add(1, 'month'));
  };

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

  const getEventsForDay = (date: moment.Moment) => {
    return calendarEvents.filter((event: any) => {
      const eventDate = moment(event.start);
      return eventDate.format('YYYY-MM-DD') === date.format('YYYY-MM-DD');
    });
  };

  const getColorClassName = (hexColor: string): string => {
    const colorMap: { [key: string]: string } = {
      '#F97316': 'orange',
      '#f97316': 'orange',
      '#EAB308': 'yellow',
      '#eab308': 'yellow',
      '#ffc107': 'yellow',
      '#FFC107': 'yellow',
      '#22C55E': 'green',
      '#22c55e': 'green',
      '#4caf50': 'green',
      '#4CAF50': 'green',
      '#14B8A6': 'teal',
      '#14b8a6': 'teal',
      '#009688': 'teal',
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
    };
    return colorMap[hexColor] || 'yellow';
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

          return (
            <div
              className={`calendar-cell ${isOtherMonth ? 'other-month' : ''} ${isToday ? 'today' : ''}`}
              key={dayIndex}
            >
              <span className="cell-date">{day.date()}</span>
              <div className="cell-events">
                {eventsForDay.slice(0, 3).map((event: any, eventIndex: number) => {
                  const colorClass = getColorClassName(event.event_data?.course_color || '#ffc107');
                  return (
                    <div
                      key={eventIndex}
                      className={`event-chip ${colorClass}`}
                      role="button"
                      tabIndex={0}
                      onClick={() => handleEventClick(event)}
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

            <button className="notification-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span className="notification-badge"></span>
            </button>

            <div className="user-menu-container" ref={userMenuRef}>
              <div className="user-menu" onClick={handleUserMenuToggle}>
                <div className="user-avatar">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
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
                return (
                  <div
                    key={index}
                    className={`mini-day ${isOtherMonth ? 'other-month' : ''} ${isToday ? 'today' : ''}`}
                    onClick={() => {
                      setCurrentDate(day.clone());
                      setMiniCalendarDate(day.clone());
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
              {syllabusDropDownData.map((item: any) => {
                const colorClass = getColorClassName(item?.other?.course_color || '#ffc107');
                return (
                  <label className="class-item" key={item.value}>
                    <input
                      type="checkbox"
                      checked={selectedClasses.includes(item.value)}
                      onChange={() => handleToggleClass(item.value)}
                    />
                    <span className={`checkmark ${colorClass}`}></span>
                    <span className="class-name">{item.label}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </aside>

        <div className="calendar-main">
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
              <h2 className="current-month">{currentDate.format('MMMM YYYY')}</h2>
              <button className="cal-nav-btn next" onClick={handleNext}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </div>

          {currentView === 'month' && (
            <div className="calendar-grid">
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
              <p>Week view - Coming soon</p>
            </div>
          )}

          {currentView === 'day' && (
            <div className="day-view">
              <p>Day view - Coming soon</p>
            </div>
          )}
        </div>
      </div>

      {deleteShow && (
        <div className="confirm-modal-overlay">
          <div className="confirm-modal">
            <div className="confirm-modal-header">
              <div className="confirm-modal-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  <line x1="10" y1="11" x2="10" y2="17" />
                  <line x1="14" y1="11" x2="14" y2="17" />
                </svg>
              </div>
              <h3 className="confirm-modal-title">Delete Event</h3>
            </div>
            <div className="confirm-modal-body">
              <p className="confirm-modal-message">Are you sure you want to delete this? This action cannot be undone.</p>
            </div>
            <div className="confirm-modal-footer">
              <button className="btn btn-cancel" onClick={handleDeleteClose}>Cancel</button>
              <button className="btn btn-confirm-delete" onClick={handleDeleteConfirm}>Delete</button>
            </div>
          </div>
        </div>
      )}

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
