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
import { ENUMFORROUTES } from '../../../interfaces/enum';
import { useNavigate } from 'react-router-dom';
import { logoutFromSystem } from '../../../redux/Service/auth/login';
import { getUserAPI } from '../../../redux/Service/User/Settings/settings';
import { useSidebar } from '../../../layouts/DashboardLayout';
import AddEditSyllabus from '../../../common/AddSyllabusEvents/AddEditSyllabus';

const Courses = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { toggleSidebar } = useSidebar();

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
    }
  }, [coursesData.isUpdatedSyllabusData]);

  /** -------------------Delete course-------------------------*/
  const [deleteShow, setDeleteShow] = useState(false);
  const [deleteCourseId, setDeleteCourseId] = useState<number | null>(null);

  const handleDeleteShow = (e: React.MouseEvent, courseId: number) => {
    e.stopPropagation();
    setDeleteCourseId(courseId);
    setDeleteShow(true);
  };

  const handleDeleteClose = () => {
    setDeleteShow(false);
    setDeleteCourseId(null);
  };

  const handleDeleteConfirm = async () => {
    if (deleteCourseId) {
      const reqBody = { course_id: deleteCourseId };
      const response = await dispatch(deleteSyllabusDataAPI(reqBody));
      if (!isNullUndefinedOrBlank(response?.payload)) {
        handleDeleteClose();
        handleGetCoursesList();
      }
    }
  };

  /** -------------------Add syllabus modal-------------------------*/
  const handleSyllabusShow = () => {
    setShowSyllabus(true);
  };

  const handleGetUpdatedData = () => {
    handleGetCoursesList();
  };

  /** -------------------Navigate to course detail-------------------------*/
  const handleCourseClick = (courseId: number) => {
    navigate(`${ENUMFORROUTES.EDIT_COURSE}?id=${courseId}`);
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
              <h3 className="confirm-modal-title">Delete Course</h3>
            </div>
            <div className="confirm-modal-body">
              <p className="confirm-modal-message">Are you sure you want to delete this course? This action cannot be undone.</p>
            </div>
            <div className="confirm-modal-footer">
              <button className="btn btn-cancel" onClick={handleDeleteClose}>Cancel</button>
              <button className="btn btn-confirm-delete" onClick={handleDeleteConfirm}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Courses Content */}
      <div className="courses-page">
        {/* Courses Grid */}
        <div className="courses-grid">
          {courses && courses.length > 0 ? (
            courses.map((course: any) => {
              const colorClass = getColorClassName(course?.course_color);
              const eventCount = course?.events_count || 0;

              return (
                <div
                  key={course.id}
                  className="course-card"
                  onClick={() => handleCourseClick(course.id)}
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
                        <span>{course.course_time || '-'}</span>
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
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="no-courses-message">
              <p>No courses found</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Syllabus Modal */}
      <AddEditSyllabus
        showSyllabus={showSyllabus}
        setShowSyllabus={setShowSyllabus}
        handleGetData={handleGetUpdatedData}
      />
    </>
  );
};

export default Courses;
