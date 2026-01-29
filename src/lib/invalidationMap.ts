import { QueryClient } from '@tanstack/react-query';
import { queryKeys } from './queryKeys';

/**
 * Invalidation helpers for mutations.
 * 
 * When data changes (create/update/delete), we need to refresh related cached data.
 * These helpers ensure we invalidate all the right queries consistently.
 */

/**
 * Call after task create/edit/delete/status change
 */
export const invalidateOnTaskChange = (qc: QueryClient) => {
  qc.invalidateQueries({ queryKey: queryKeys.tasks });
  qc.invalidateQueries({ queryKey: ['tasks', 'listing'] }); // partial match for any filters
  qc.invalidateQueries({ queryKey: queryKeys.myWeek });
  qc.invalidateQueries({ queryKey: queryKeys.dashboardCounts });
};

/**
 * Call after event create/edit/delete
 */
export const invalidateOnEventChange = (qc: QueryClient) => {
  qc.invalidateQueries({ queryKey: queryKeys.events });
  qc.invalidateQueries({ queryKey: ['events', 'listing'] }); // partial match for any date range
  qc.invalidateQueries({ queryKey: queryKeys.myWeek });
  qc.invalidateQueries({ queryKey: queryKeys.dashboardCounts });
};

/**
 * Call after syllabus upload/delete
 */
export const invalidateOnSyllabusChange = (qc: QueryClient) => {
  qc.invalidateQueries({ queryKey: queryKeys.syllabusDropdown });
  qc.invalidateQueries({ queryKey: queryKeys.courses });
};

/**
 * Call after course create/edit/delete
 */
export const invalidateOnCourseChange = (qc: QueryClient, courseId?: string) => {
  qc.invalidateQueries({ queryKey: queryKeys.courses });
  qc.invalidateQueries({ queryKey: queryKeys.syllabusDropdown });
  if (courseId) {
    qc.invalidateQueries({ queryKey: queryKeys.courseDetail(courseId) });
  }
};

/**
 * Call after notification read/clear
 */
export const invalidateOnNotificationChange = (qc: QueryClient) => {
  qc.invalidateQueries({ queryKey: queryKeys.notifications });
  qc.invalidateQueries({ queryKey: queryKeys.notificationCount });
};
