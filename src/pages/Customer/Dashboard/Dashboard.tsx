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
import moment from 'moment';
import { ENUMFORROUTES, ENUMFORSTATUS } from '../../../interfaces/enum';
import { updateEventStatusDataAPI } from '../../../redux/Service/User/Courses/courses';
import { useNavigate } from 'react-router-dom';
import { logoutFromSystem } from '../../../redux/Service/auth/login';
import { getUserAPI } from '../../../redux/Service/User/Settings/settings';
import { useSidebar } from '../../../layouts/DashboardLayout';
import { useNotificationPanel } from '../../../components/Notifications/NotificationPanelContext';

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

  /** -----------------event listing api start---------------------------*/
  const [eventData, setEventData] = useState<any>([]);
  const [todayDate, setTodayDate] = useState<any>(null);
  const [startDate, setStartDate] = useState(moment().startOf('week').format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(moment().endOf('week').format('YYYY-MM-DD'));

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

  const handleEventListing = async () => {
    const start_date = getDate(startDate);
    const end_date = getDate(endDate);
    const reqBody = { start_date, end_date };
    customJsonInclude(reqBody);

    try {
      const response = await dispatch(dashboardEventListingAPI(reqBody));
      if (response && !isNullUndefinedOrBlank(response)) {
        setEventData(response?.payload?.dueEventData);
      }
    } catch (error) {
      console.error('Error fetching event data:', error);
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

  /** --------------------Map hex colors to CSS class names------------------------*/
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
    const response = await dispatch(updateEventStatusDataAPI(reqBody));
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
            <button className="mobile-menu-toggle" onClick={toggleSidebar}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>

            <h1 className="dashboard-page-title">My Week</h1>

            <button className="today-btn" onClick={() => handleDateChange('today')}>
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
              const colorClass = getColorClassName(item?.other?.course_color);
              return (
                <button className={`course-pill ${colorClass}`} key={index}>
                  <span className="pill-dot"></span>
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
              <div className="col-actions">Actions</div>
              <div className="col-time">Time</div>
              <div className="col-priority">Priority</div>
              <div className="col-course">Course Name</div>
              <div className="col-event">Event Name</div>
              <div className="col-delete">Actions</div>
            </div>

            {/* Dynamic Events Container */}
            <div id="dashboardEventsContainer">
              {eventData?.map((group: any, groupIndex: number) => (
                <React.Fragment key={groupIndex}>
                  {/* Due Date Header */}
                  <div className="due-date-header">
                    Due on{' '}
                    {!isNullUndefinedOrBlank(group?.due_date)
                      ? formatedDate(group?.due_date, 'dddd, MMM DD')
                      : '-'}
                  </div>

                  {/* Event Rows */}
                  {group?.eventData?.map((event: any, eventIndex: number) => (
                    <div
                      key={eventIndex}
                      className={`task-row clickable-event ${
                        event?.status === ENUMFORSTATUS.COMPLETED ? 'completed' : ''
                      }`}
                      onClick={() => handleSelectEvent(event)}
                    >
                      <div className="col-actions">
                        <button
                          className="action-btn complete-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEventCompleted([event?.id], event?.status);
                          }}
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            {event?.status === ENUMFORSTATUS.COMPLETED ? (
                              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            ) : (
                              <circle cx="12" cy="12" r="10" />
                            )}
                            <polyline points="22 4 12 14.01 9 11.01" />
                          </svg>
                        </button>
                      </div>

                      <div className="col-time">
                        <span
                          className="time-indicator"
                          style={{ background: event?.syllabus?.course_color }}
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
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>
        ) : (
          <div className="no-tasks-message">
            <p>No events found for this week</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
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
              <button className="btn btn-confirm-delete" onClick={handleDeleteData}>Delete</button>
            </div>
          </div>
        </div>
      )}

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
        onUpgradeClick={handleUpgradeClick}
        existingSyllabusCount={syllabusDropDownData.length}
      />
    </>
  );
};

export default Dashboard;
