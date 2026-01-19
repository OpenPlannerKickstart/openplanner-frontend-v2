import React, { useEffect, useState, useRef } from 'react';
import { AppDispatch, RootState } from '../../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import {
  getCoursesListDataAPI,
  deleteSyllabusDataAPI,
} from '../../../redux/Service/User/Courses/courses';
import {
  formatedDate,
  isEmptyObjectOrNullUndefiend,
  isNullUndefinedOrBlank,
} from '../../../Utility/Helper';
import moment from 'moment';
import { ENUMFORROUTES } from '../../../interfaces/enum';
import { useNavigate } from 'react-router-dom';
import { logoutFromSystem } from '../../../redux/Service/auth/login';
import { getUserAPI } from '../../../redux/Service/User/Settings/settings';
import { useSidebar } from '../../../layouts/DashboardLayout';
import AddEditSyllabus from '../../../common/AddSyllabusEvents/AddEditSyllabus';
import { useNotificationPanel } from '../../../components/Notifications/NotificationPanelContext';
import ConfirmDeleteModal from '../../../components/ConfirmDeleteModal/ConfirmDeleteModal';
import { isUpdatedSyllabus } from '../../../redux/User/Courses/coursesSlice';
import { useReferralUploadLimit } from '../../../hooks/useReferralUploadLimit';
import ReferralUnlockModal from '../../../components/ReferralUnlockModal/ReferralUnlockModal';

const Courses = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { toggleSidebar } = useSidebar();
  const { open: openNotifications, unreadCount } = useNotificationPanel();

  const settingsData: any = useSelector((state: RootState) => state.SettingsReducer);
  const coursesData: any = useSelector((state: RootState) => state.CoursesReducer);

  /** -----------------User menu and notification state---------------------------*/
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  /** -----------------Courses state---------------------------*/
  const [courses, setCourses] = useState<any>([]);
  const [showSyllabus, setShowSyllabus] = useState(false);

  /** -------------------Get courses list-------------------------*/
  const handleGetCoursesList = async () => {
    try {
      const reqBody = {};
      const response = await dispatch(getCoursesListDataAPI(reqBody));
      if (response && !isNullUndefinedOrBlank(response?.payload)) {
        setCourses(response.payload);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  useEffect(() => {
    handleGetCoursesList();
  }, []);

  useEffect(() => {
      if (coursesData.isUpdatedSyllabusData) {
      handleGetCoursesList();
      // Reset flag so future uploads trigger refresh again
      setTimeout(() => {
        try {
          dispatch(isUpdatedSyllabus(false));
        } catch {}
      }, 250);
    }
  }, [coursesData.isUpdatedSyllabusData]);

  // Format class_time coming from backend. We store class_time as "HH:mm:ssZ" (time-only with offset).
  const formatCourseTime = (value: any): string => {
    if (isNullUndefinedOrBlank(value)) return '-';
    if (typeof value === 'string' && value.includes('-')) return value; // already a range string
    try {
      // Backend stores SQL TIME as "HH:mm:ss" (no timezone). Also accept legacy "HH:mm:ssZ".
      if (typeof value === 'string' && /^\d{2}:\d{2}:\d{2}/.test(value)) {
        const m = moment.parseZone(value, ['HH:mm:ss', 'HH:mm:ssZ'], true);
        return m.isValid() ? m.format('h:mm a') : '-';
      }
      const m = moment(value);
      return m.isValid() ? m.format('h:mm a') : '-';
    } catch {
      return '-';
    }
  };

  const getCourseEventCountFromCourse = (course: any): number | null => {
    const candidates = [
      course?.no_of_events,
      course?.events_count,
      course?.event_count,
      course?.eventsCount,
      course?.eventCount,
      course?.total_events,
      course?.totalEvents,
    ];
    for (const c of candidates) {
      const n = Number(c);
      if (Number.isFinite(n)) return n;
    }
    return null;
  };

  /** -------------------Delete course-------------------------*/
  const [deleteShow, setDeleteShow] = useState(false);
  const [deleteCourseId, setDeleteCourseId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleDeleteShow = (e: React.MouseEvent, courseId: number) => {
    e.stopPropagation();
    setDeleteCourseId(courseId);
    setDeleteShow(true);
  };

  const handleDeleteClose = () => {
    if (deleteLoading) return;
    setDeleteShow(false);
    setDeleteCourseId(null);
  };

  const handleDeleteConfirm = async () => {
    if (deleteCourseId) {
      try {
        setDeleteLoading(true);
        // Backend expects syllabus id(s), not `course_id`
        // (matches SyllabusDetails.tsx delete flow)
        const reqBody = { id: [deleteCourseId] };
        const response = await dispatch(deleteSyllabusDataAPI(reqBody));
        if (!isNullUndefinedOrBlank(response?.payload)) {
          setDeleteShow(false);
          setDeleteCourseId(null);
          handleGetCoursesList();
        }
      } finally {
        setDeleteLoading(false);
      }
    }
  };

  /** -------------------Freemium limit logic-------------------------*/
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
    existingSyllabusCount: courses.length,
  });

  // Referral modal state for freemium limit
  const [showReferralModal, setShowReferralModal] = useState(false);

  const handleReferralClick = () => {
    setShowReferralModal(true);
  };

  const handleUpgradeClick = () => {
    navigate(ENUMFORROUTES.PLAN_DETAILS);
  };

  /** -------------------Add syllabus modal-------------------------*/
  const handleSyllabusShow = () => {
    if (upgradeRequired) {
      handleUpgradeClick();
      return;
    }
    if (freemiumLimitReached) {
      setShowReferralModal(true);
      return;
    }
    setShowSyllabus(true);
  };

  const handleGetUpdatedData = () => {
    handleGetCoursesList();
  };

  /** -------------------Navigate to course detail-------------------------*/
  const handleCourseClick = (course: any) => {
    navigate(`${ENUMFORROUTES.EDIT_COURSE}?id=${course.id}`, {
      state: { syllabusObj: course }
    });
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

  /** --------------------Map hex colors to CSS class names------------------------*/
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

            <h1 className="dashboard-page-title">All Courses</h1>
          </div>

          <div className="dashboard-header-right">
            <button className="btn btn-accent" onClick={handleSyllabusShow}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
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

      {upgradeRequired && (
        <div className="alert alert-warning d-flex align-items-center justify-content-between gap-2">
          <div>
            <strong>Free plan limit reached.</strong> You can upload up to 3 syllabi on the free plan. Upgrade to keep adding courses.
          </div>
          <button type="button" className="btn btn-primary btn-sm" onClick={handleUpgradeClick}>
            View plans
          </button>
        </div>
      )}

      <ConfirmDeleteModal
        show={deleteShow}
        onClose={handleDeleteClose}
        onConfirm={handleDeleteConfirm}
        /* Reuse Delete Conversation modal styling, but no header */
        message={
          <>
            Are you sure you want to delete this? This action cannot be undone.
          </>
        }
        cancelText="Cancel"
        confirmText="Delete"
        loading={deleteLoading}
      />

      {/* Courses Content */}
      <div className="courses-page">
        {/* Courses Grid */}
        <div className="courses-grid">
          {courses && courses.length > 0 ? (
            courses.map((course: any) => {
              const colorClass = getColorClassName(course?.course_color);
              const eventCountFromCourse = getCourseEventCountFromCourse(course);
              const eventCount = eventCountFromCourse ?? 0;
              const classTimeDisplay =
                course?.class_time_display ||
                formatCourseTime(course?.class_time ?? course?.course_time ?? course?.classTime);

              return (
                <div
                  key={course.id}
                  className="course-card"
                  onClick={() => handleCourseClick(course)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className={`course-banner ${colorClass}`}>
                    <div className="course-icon">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                        <line x1="8" y1="7" x2="16" y2="7" />
                        <line x1="8" y1="11" x2="14" y2="11" />
                      </svg>
              </div>
                  </div>
                  <div className="course-content">
                    <h3 className="course-name">{course.title || course.course_name}</h3>
                    <div className="course-meta">
                      <div className="meta-item">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        <span>{classTimeDisplay}</span>
                  </div>
                      <div className="meta-item color-tag">
                        <span className={`color-swatch ${colorClass}`}></span>
                        <span>{course.course_color}</span>
                  </div>
                </div>
                    <div className="course-footer">
                      <div className="event-count">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        <span>
                          Event: <strong>{eventCount}</strong>
                        </span>
                </div>
                      <button
                        className="delete-course-btn"
                        onClick={(e) => handleDeleteShow(e, course.id)}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          <line x1="10" y1="11" x2="10" y2="17" />
                          <line x1="14" y1="11" x2="14" y2="17" />
                        </svg>
                </button>
                  </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="courses-empty-state">
              <div className="courses-empty-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  <line x1="8" y1="7" x2="16" y2="7" />
                  <line x1="8" y1="11" x2="14" y2="11" />
                </svg>
              </div>
              <h3 className="courses-empty-title">No Courses Yet</h3>
              <p className="courses-empty-text">
                Upload your first syllabus to get started. We'll automatically create your course schedule and events.
              </p>
              <button className="btn btn-accent courses-empty-btn" onClick={handleSyllabusShow}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Add Your First Syllabus
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add Syllabus Modal */}
      <AddEditSyllabus
        showSyllabus={showSyllabus}
        setShowSyllabus={setShowSyllabus}
        handleGetData={handleGetUpdatedData}
        freemiumLimitReached={freemiumLimitReached}
        hasSubscription={hasSubscription}
        isFreemiumPlan={isFreemiumPlan}
        onReferralClick={handleReferralClick}
        onUpgradeClick={handleUpgradeClick}
        upgradeRequired={upgradeRequired}
        existingSyllabusCount={courses.length}
      />

      <ReferralUnlockModal
        show={showReferralModal}
        onClose={() => setShowReferralModal(false)}
        referralLink={referralLink}
        referralSentCount={referralSentCount}
        existingSyllabusCount={courses.length}
        onReferralSent={markReferralSent}
      />
    </>
  );
};

export default Courses;
