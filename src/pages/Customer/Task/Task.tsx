import React, { useEffect, useState, useRef } from 'react';
import { AppDispatch } from '../../../redux/store';
import { useDispatch } from 'react-redux';
import { useQueryClient } from '@tanstack/react-query';
import { formatedDate, isNullUndefinedOrBlank } from '../../../Utility/Helper';
import { ENUMFORROUTES, ENUMFORSTATUS } from '../../../interfaces/enum';
import { useNavigate } from 'react-router-dom';
import { logoutFromSystem } from '../../../redux/Service/auth/login';
import { useSidebar } from '../../../layouts/DashboardLayout';
import { useUser } from '../../../hooks/queries/useUser';
import { useTasks, useUpdateTaskStatus, useUpdateTaskStar } from '../../../hooks/queries/useTasks';
import { invalidateOnTaskChange } from '../../../lib/invalidationMap';
import AddEditTask from '../../../common/Task/AddEditTask';
import AddEditEvent from '../../../common/AddSyllabusEvents/AddEditEvent';
import { useNotificationPanel } from '../../../components/Notifications/NotificationPanelContext';

const Task = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { toggleSidebar } = useSidebar();
  const { open: openNotifications, unreadCount } = useNotificationPanel();

  // React Query client for cache invalidation
  const queryClient = useQueryClient();

  // Task data - cached and shared, shows instantly on return visits
  const { data: taskData = [] } = useTasks();

  // Task mutations with optimistic updates
  const updateStatusMutation = useUpdateTaskStatus();
  const updateStarMutation = useUpdateTaskStar();

  // User data - cached and shared across pages
  const { data: userData } = useUser();

  /** -----------------User menu and notification state---------------------------*/
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  /** -----------------Task state---------------------------*/
  const [activeTab, setActiveTab] = useState<'todo' | 'completed' | 'starred'>('todo');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editTaskFormData, setEditTaskFormData] = useState<any>(null);
  
  /** -----------------Task Details Modal state (for viewing existing tasks)---------------------------*/
  const [showTaskDetailsModal, setShowTaskDetailsModal] = useState(false);
  const [viewTaskFormData, setViewTaskFormData] = useState<any>(null);

  /** -------------------Task complete/incomplete toggle-------------------------*/
  const handleTaskToggle = (taskId: number, currentStatus: string) => {
    const newStatus = currentStatus === ENUMFORSTATUS.COMPLETED ? ENUMFORSTATUS.PENDING : ENUMFORSTATUS.COMPLETED;
    // Mutation with optimistic update is handled by the hook
    updateStatusMutation.mutate({
      id: [taskId],
      status: newStatus,
    });
  };

  /** -------------------Star/unstar task-------------------------*/
  const handleToggleStar = (taskId: number, currentIsStarred: boolean) => {
    // Mutation with optimistic update is handled by the hook
    updateStarMutation.mutate({
      task_id: taskId,
      is_starred: !currentIsStarred,
    });
  };

  /** -------------------Add/Edit task modal-------------------------*/
  const handleShow = () => {
    setEditTaskFormData(null);
    setShowTaskModal(true);
  };

  const handleSelectTask = (task: any) => {
    const rawDue = task?.due_date || task?.end_date || null;
    const dueDate = !isNullUndefinedOrBlank(rawDue)
      ? new Date(formatedDate(rawDue, 'yyyy-MM-DD HH:mm:ss'))
      : null;
    
    // For the start_date, use the same as due_date or a time 30 mins before
    const startDate = dueDate ? new Date(dueDate.getTime() - 30 * 60 * 1000) : null;

    // Open the Task Details modal (AddEditEvent in task mode) instead of AddEditTask
    setViewTaskFormData({
      id: task?.id,
      title: task?.task_name || task?.title || '',
      note: task?.note || '',
      start_date: startDate,
      end_date: dueDate,
      is_reminder: !!task?.is_reminder,
      reminder: task?.reminder || [],
      status: task?.status,
      priority: task?.priority || 'Low',
    });
    setShowTaskDetailsModal(true);
  };

  const handleGetUpdatedData = () => {
    // Invalidate task cache to refresh the list
    invalidateOnTaskChange(queryClient);
  };

  /** -------------------User menu and notification handlers-------------------------*/
  const handleUserMenuToggle = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleLogout = async () => {
    await dispatch(logoutFromSystem());
    navigate(ENUMFORROUTES.LOGIN);
  };

  // Note: userData now comes from useUser() hook (cached and shared across pages)

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

      {/* Add Task Modal (for creating new tasks) */}
      <AddEditTask
        show={showTaskModal}
        setShow={setShowTaskModal}
        handleGetData={handleGetUpdatedData}
        editTaskFormData={editTaskFormData}
        setEditTaskFormData={setEditTaskFormData}
      />

      {/* Task Details Modal (for viewing/editing existing tasks) */}
      <AddEditEvent
        show={showTaskDetailsModal}
        setShow={setShowTaskDetailsModal}
        handleGetData={handleGetUpdatedData}
        editEventFormData={viewTaskFormData}
        setEditEventFormData={setViewTaskFormData}
        entityType="task"
      />
    </>
  );
};

export default Task;

