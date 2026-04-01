/**
 * Feature Flags
 * 
 * Centralized feature flag configuration.
 * Toggle these to enable/disable features across the app.
 * 
 * To enable a feature: set the flag to `true`
 * To disable a feature: set the flag to `false`
 */

export const FEATURE_FLAGS = {
  /**
   * Groups feature - includes:
   * - Groups tab in sidebar
   * - Groups page and routes
   * - Join group modals after syllabus upload
   * - Student chat functionality
   */
  GROUPS_ENABLED: false,

  /**
   * Grades feature - includes:
   * - Grades tab on course detail page
   * - Grade prediction and tracking
   */
  GRADES_ENABLED: true,
} as const;

// Helper function to check if a feature is enabled
export function isFeatureEnabled(feature: keyof typeof FEATURE_FLAGS): boolean {
  return FEATURE_FLAGS[feature];
}

// Shortcut helpers for common checks
export const isGroupsEnabled = () => FEATURE_FLAGS.GROUPS_ENABLED;
export const isGradesEnabled = () => FEATURE_FLAGS.GRADES_ENABLED;
