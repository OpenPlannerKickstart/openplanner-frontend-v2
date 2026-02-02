import { get, post } from '../Utility/httpInterceptor';
import {
  GET_ALL_NOTIFICATION_API,
  GET_COUNT_OF_UNREAD_NOTIFICATION_API,
  READ_NOTIFICATION_API,
  CLEAR_NOTIFICATION_API,
} from '../Utility/ApiList';

/**
 * Notification data from the API
 */
export interface NotificationData {
  id: number | string;
  user_id?: number | string;
  message?: string;
  userType?: string;
  is_read?: boolean;
  created_at?: string;
  duration?: number;
  isNew?: boolean;
  // Structured fields from backend
  type_name?: string;
  type?: 'event' | 'task';
  entity_name?: string | null;
  entity_date?: string | null;
  event_id?: string | null;
  task_id?: string | null;
  syllabus_name?: string | null;
}

/**
 * Fetch all notifications for the current user
 *
 * @returns Array of notification objects
 * @throws Error if the API returns an error
 */
export const fetchNotifications = async (): Promise<NotificationData[]> => {
  const response: any = await get(GET_ALL_NOTIFICATION_API);

  if (response.data.error) {
    throw new Error(response.data.message || 'Failed to fetch notifications');
  }

  return response.data.data || [];
};

/**
 * Fetch unread notification count for badge display
 *
 * @returns Number of unread notifications
 * @throws Error if the API returns an error
 */
export const fetchUnreadCount = async (): Promise<number> => {
  const response: any = await get(GET_COUNT_OF_UNREAD_NOTIFICATION_API);

  if (response.data.error) {
    throw new Error(response.data.message || 'Failed to fetch notification count');
  }

  return response.data.data?.count ?? 0;
};

/**
 * Mark notifications as read
 */
export interface MarkNotificationReadParams {
  id: (number | string)[];
  is_read: boolean;
}

export const markNotificationRead = async (params: MarkNotificationReadParams): Promise<any> => {
  const response: any = await post(READ_NOTIFICATION_API, params);

  if (response.data.error) {
    throw new Error(response.data.message || 'Failed to mark notification as read');
  }

  return response.data.data;
};

/**
 * Clear/dismiss notifications
 */
export interface ClearNotificationParams {
  id: (number | string)[];
}

export const clearNotification = async (params: ClearNotificationParams): Promise<any> => {
  const response: any = await post(CLEAR_NOTIFICATION_API, params);

  if (response.data.error) {
    throw new Error(response.data.message || 'Failed to clear notification');
  }

  return response.data.data;
};
