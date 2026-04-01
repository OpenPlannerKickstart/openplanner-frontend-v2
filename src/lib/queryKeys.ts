/**
 * Centralized query keys for React Query cache management.
 * Using a consistent key structure makes cache invalidation predictable.
 */
export const queryKeys = {
  // Dashboard
  dashboardCounts: ['dashboard', 'counts'] as const,
  myWeek: ['myWeek'] as const,

  // Events
  events: ['events'] as const,
  eventListing: (range: { start: string; end: string }) =>
    ['events', 'listing', range] as const,

  // Tasks
  tasks: ['tasks'] as const,
  taskListing: (filters?: Record<string, any>) =>
    ['tasks', 'listing', filters] as const,

  // Syllabus/Courses
  syllabusDropdown: ['syllabus', 'dropdown'] as const,
  courses: ['courses'] as const,
  courseDetail: (id: string) => ['courses', id] as const,

  // User
  user: ['user'] as const,

  // Grades
  gradingPolicy: (syllabusId: number | string) =>
    ['grades', 'policy', syllabusId] as const,
  gradeSummary: (syllabusId: number | string) =>
    ['grades', 'summary', syllabusId] as const,
  eventsWorth: (syllabusId: number | string) =>
    ['grades', 'worth', syllabusId] as const,

  // Notifications
  notifications: ['notifications'] as const,
  notificationCount: ['notifications', 'count'] as const,
} as const;
