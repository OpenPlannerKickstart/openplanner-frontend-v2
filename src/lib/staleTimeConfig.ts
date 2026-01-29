/**
 * Per-query staleTime overrides.
 * 
 * These control how long each data type is considered "fresh" before
 * React Query will refetch in the background.
 * 
 * Lower values = more frequent background refreshes (but not blocking)
 * Higher values = less network traffic, more reliance on cache
 */
export const staleTimeConfig = {
  // Need to feel current - shorter stale times
  dashboardCounts: 30_000,      // 30 seconds
  myWeek: 30_000,               // 30 seconds

  // Moderate freshness
  eventListing: 60_000,         // 1 minute
  taskListing: 60_000,          // 1 minute

  // Changes less frequently
  syllabusDropdown: 120_000,    // 2 minutes

  // Rarely changes
  courses: 300_000,             // 5 minutes
  user: 300_000,                // 5 minutes

  // Notifications
  notifications: 60_000,        // 1 minute
  notificationCount: 30_000,    // 30 seconds (badge should feel current)
} as const;
