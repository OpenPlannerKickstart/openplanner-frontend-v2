import React, { useCallback, useEffect, useState, useRef } from 'react';
import { AppDispatch, RootState } from '../../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { upadteTaskStatusAPI, updateTaskStarAPI, taskListingAPI } from '../../../redux/Service/task';
import {
  formatedDate,
  isNullUndefinedOrBlank,
} from '../../../Utility/Helper';
import { ENUMFORROUTES, ENUMFORSTATUS } from '../../../interfaces/enum';
import { useNavigate } from 'react-router-dom';
import { logoutFromSystem } from '../../../redux/Service/auth/login';
import { getUserAPI } from '../../../redux/Service/User/Settings/settings';
import { useSidebar } from '../../../layouts/DashboardLayout';
import AddEditEvent from '../../../common/AddSyllabusEvents/AddEditEvent';
import { useNotificationPanel } from '../../../components/Notifications/NotificationPanelContext';

const Task = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { toggleSidebar } = useSidebar();
  const { open: openNotifications, unreadCount } = useNotificationPanel();

  const settingsData: any = useSelector((state: RootState) => state.SettingsReducer);

  /** -----------------User menu and notification state---------------------------*/
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  /** -----------------Task state---------------------------*/
  const [taskData, setTaskData] = useState<any>([]);
  const [activeTab, setActiveTab] = useState<'todo' | 'completed' | 'starred'>('todo');
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [editEventFormData, setEditEventFormData] = useState<any>(null);

  /** -------------------Task listing api start-------------------------*/
  const handleTaskListing = useCallback(async () => {
    try {
      // Use /taskListing for the Task List page (supports is_starred + full list)
      const response = await dispatch(taskListingAPI({}));
      if (response && !isNullUndefinedOrBlank(response?.payload)) {
        const payload: any = response.payload;
        // taskListing historically returns an object with { tasks, pending_task_count, ... }
        const tasks = Array.isArray(payload) ? payload : (payload?.tasks ?? []);
        setTaskData(Array.isArray(tasks) ? tasks : []);
        return;
      }
      setTaskData([]);
    } catch (error) {
      console.error('Error fetching task data:', error);
      setTaskData([]);
    }
  }, [dispatch]);

  useEffect(() => {
    handleTaskListing();
  }, [handleTaskListing]);

  /** -------------------Task complete/incomplete toggle-------------------------*/
  const handleTaskToggle = async (taskId: number, currentStatus: string) => {
    const newStatus = currentStatus === ENUMFORSTATUS.COMPLETED ? ENUMFORSTATUS.PENDING : ENUMFORSTATUS.COMPLETED;
    // Optimistic UI update so tasks move between tabs instantly
    setTaskData((prev: any[]) => (Array.isArray(prev)
      ? prev.map((t: any) => (t?.id === taskId ? { ...t, status: newStatus } : t))
      : prev));
    const reqBody = {
      // backend expects an array id for toggle mode (id: [taskId])
      id: [taskId],
      // explicitly set so uncomplete is reliable (BE supports set mode)
      status: newStatus,
    };
    try {
      const response = await dispatch(upadteTaskStatusAPI(reqBody));
      if (!isNullUndefinedOrBlank(response?.payload)) {
        handleTaskListing();
        return;
      }
      // revert if API didn't succeed
      setTaskData((prev: any[]) => (Array.isArray(prev)
        ? prev.map((t: any) => (t?.id === taskId ? { ...t, status: currentStatus } : t))
        : prev));
    } catch {
      setTaskData((prev: any[]) => (Array.isArray(prev)
        ? prev.map((t: any) => (t?.id === taskId ? { ...t, status: currentStatus } : t))
        : prev));
    }
  };

  /** -------------------Star/unstar task-------------------------*/
  const handleToggleStar = async (taskId: number, currentIsStarred: boolean) => {
    const newIsStarred = !currentIsStarred;
    // Optimistic UI update
    setTaskData((prev: any[]) => (Array.isArray(prev)
      ? prev.map((t: any) => (t?.id === taskId ? { ...t, is_starred: newIsStarred } : t))
      : prev));
    const reqBody = {
      // backend validators in this env appear to require arrays for IDs
      // BE supports both scalar and array; use scalar for simplest compatibility
      task_id: taskId,
      is_starred: newIsStarred,
    };
    try {
      const response = await dispatch(updateTaskStarAPI(reqBody));
      if (!isNullUndefinedOrBlank(response?.payload)) {
        handleTaskListing();
        return;
      }
      // revert if API didn't succeed
      setTaskData((prev: any[]) => (Array.isArray(prev)
        ? prev.map((t: any) => (t?.id === taskId ? { ...t, is_starred: currentIsStarred } : t))
        : prev));
    } catch {
      setTaskData((prev: any[]) => (Array.isArray(prev)
        ? prev.map((t: any) => (t?.id === taskId ? { ...t, is_starred: currentIsStarred } : t))
        : prev));
    }
  };

  /** -------------------Add/Edit task modal-------------------------*/
  const handleShow = () => {
    setEditEventFormData(null);
    setShowEventDetails(true);
  };

  const handleSelectTask = (task: any) => {
    const rawDue = task?.due_date || task?.end_date || null;
    const dueDate = !isNullUndefinedOrBlank(rawDue)
      ? new Date(formatedDate(rawDue, 'yyyy-MM-DD HH:mm:ss'))
      : null;
    const start = dueDate ?? new Date();
    const end = dueDate ? new Date(dueDate.getTime() + 30 * 60 * 1000) : new Date(start.getTime() + 30 * 60 * 1000);

    // Map Task → AddEditEvent form shape
    setEditEventFormData({
      id: task?.id,
      title: task?.task_name || task?.title || '',
      note: task?.note || '',
      start_date: start,
      end_date: end,
      is_reminder: !!task?.is_reminder,
      reminder: task?.reminder || [],
      status: task?.status,
      // syllabus_id optional for tasks; the modal will show Calendar as N/A if missing
      syllabus_id: task?.syllabus_id || task?.course_id || undefined,
      priority: task?.priority || undefined,
    });
    setShowEventDetails(true);
  };

  const handleGetUpdatedData = () => {
    handleTaskListing();
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

  /** -------------------Filter tasks by tab-------------------------*/
  const getFilteredTasks = () => {
    if (!taskData || taskData.length === 0) return [];

    switch (activeTab) {
      case 'completed':
        return taskData.filter((task: any) => task.status === ENUMFORSTATUS.COMPLETED);
      case 'starred':
        return taskData.filter((task: any) => task.is_starred === true);
      case 'todo':
      default:
        return taskData.filter((task: any) => task.status !== ENUMFORSTATUS.COMPLETED);
    }
  };

  const filteredTasks = getFilteredTasks();
  const todoCount = taskData.filter((task: any) => task.status !== ENUMFORSTATUS.COMPLETED).length;
  const completedCount = taskData.filter((task: any) => task.status === ENUMFORSTATUS.COMPLETED).length;
  const starredCount = taskData.filter((task: any) => task.is_starred === true).length;

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

            <h1 className="dashboard-page-title">All Tasks</h1>
          </div>

          <div className="dashboard-header-right">
            <button className="btn btn-primary" onClick={handleShow}>
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
              Add Task
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
                <button
                  type="button"
                  className="user-dropdown-item"
                  onClick={() => { navigate(ENUMFORROUTES.SETTINGS); setIsUserMenuOpen(false); }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  Profile
                </button>
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

      {/* Tasks Content */}
      <div className="tasks-page">
        {/* Tabs and Filters */}
        <div className="tasks-toolbar">
          <div className="tasks-tabs">
            <button
              className={`tab-btn ${activeTab === 'todo' ? 'active' : ''}`}
              onClick={() => setActiveTab('todo')}
            >
              <span>To do</span>
              <span className="tab-count">{todoCount}</span>
            </button>
            <button
              className={`tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
              onClick={() => setActiveTab('completed')}
            >
              <span>Completed</span>
              <span className="tab-count">{completedCount}</span>
            </button>
            <button
              className={`tab-btn ${activeTab === 'starred' ? 'active' : ''}`}
              onClick={() => setActiveTab('starred')}
            >
              <span>Starred</span>
              <span className="tab-count">{starredCount}</span>
            </button>
          </div>
        </div>

        {/* Tasks List */}
        <div className="tasks-list-container">
          <div className="tasks-list">
            {filteredTasks && filteredTasks.length > 0
              ? filteredTasks.map((task: any) => (
                  <div
                    key={task.id}
                    className={`task-item clickable-event ${task.status === ENUMFORSTATUS.COMPLETED ? 'completed' : ''}`}
                    role="button"
                    tabIndex={0}
                    style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '12px' }}
                    onClick={() => handleSelectTask(task)}
                  >
                    <button
                      className="task-checkbox"
                      aria-label="Mark as complete"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTaskToggle(task.id, task.status);
                      }}
                    >
                      <svg className="check-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </button>
                    <div className="task-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                      <span className="task-name">{task.task_name || task.title}</span>
                      <span className="task-due">{formatedDate(task.due_date || task.end_date, 'MMM DD, YYYY')}</span>
                    </div>
                    <button
                      className={`task-star ${task.is_starred ? 'starred' : ''}`}
                      aria-label="Mark as important"
                      onClick={(e) => { e.stopPropagation(); handleToggleStar(task.id, task.is_starred); }}
                      type="button"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    </button>
                  </div>
                ))
              : null}
          </div>

          {/* Add Task Row - always visible (also serves as empty-state affordance) */}
          <div className="add-task-row" style={{ cursor: 'pointer' }} onClick={handleShow} role="button" tabIndex={0}>
            <button className="add-task-circle" type="button" onClick={(e) => { e.stopPropagation(); handleShow(); }} aria-label="Add a task">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
            <span className="add-task-input" style={{ color: 'var(--neutral-400)', pointerEvents: 'none' }}>Add a task</span>
          </div>

          {/* Empty state: show ONLY the "Add a task" row (no illustration/text) */}
        </div>
      </div>

      {/* Event Details Modal (used for tasks as a sub-type of events) */}
      <AddEditEvent
        show={showEventDetails}
        setShow={setShowEventDetails}
        handleGetData={handleGetUpdatedData}
        editEventFormData={editEventFormData}
        setEditEventFormData={setEditEventFormData}
        selectedCourse={null}
        entityType="task"
      />
    </>
  );
};

export default Task;
