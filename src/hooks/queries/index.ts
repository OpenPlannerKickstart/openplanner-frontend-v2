// Query hooks - data fetching with caching
export { useSyllabusDropdown, useDeleteSyllabus } from './useSyllabusDropdown';
export { useUser } from './useUser';
export { useCourses } from './useCourses';

// Task hooks
export {
  useTasks,
  useAddEditTask,
  useDeleteTask,
  useUpdateTaskStatus,
  useUpdateTaskStar,
} from './useTasks';

// Event hooks
export {
  useCalendarEvents,
  useAddEditEvent,
  useAddEditEventSilent,
  useDeleteEvent,
  useUpdateEventStatus,
} from './useEvents';

// Notification hooks
export {
  useNotifications,
  useUnreadCount,
  useMarkNotificationRead,
  useClearNotification,
} from './useNotifications';
