import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../lib/queryKeys';
import { staleTimeConfig } from '../../lib/staleTimeConfig';
import { invalidateOnNotificationChange } from '../../lib/invalidationMap';
import {
  fetchNotifications,
  fetchUnreadCount,
  markNotificationRead,
  clearNotification,
  NotificationData,
  MarkNotificationReadParams,
  ClearNotificationParams,
} from '../../api/notifications';

/**
 * Hook to fetch and cache all notifications.
 *
 * Used in NotificationPanel to display the notification list.
 *
 * Features:
 * - Returns cached data instantly on subsequent opens
 * - Refetches in background when stale (1 min)
 * - Cache invalidated on read/clear operations
 *
 * @example
 * const { data: notifications = [], isLoading } = useNotifications();
 */
export function useNotifications() {
  return useQuery<NotificationData[], Error>({
    queryKey: queryKeys.notifications,
    queryFn: fetchNotifications,
    staleTime: staleTimeConfig.notifications,
  });
}

/**
 * Hook to fetch unread notification count for badge display.
 *
 * Used in DashboardLayout for the notification badge.
 *
 * @example
 * const { data: unreadCount = 0 } = useUnreadCount();
 */
export function useUnreadCount() {
  return useQuery<number, Error>({
    queryKey: queryKeys.notificationCount,
    queryFn: fetchUnreadCount,
    staleTime: staleTimeConfig.notificationCount,
  });
}

/**
 * Mutation hook for marking notifications as read with optimistic updates.
 */
export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markNotificationRead,
    onMutate: async (variables: MarkNotificationReadParams) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.notifications });
      await queryClient.cancelQueries({ queryKey: queryKeys.notificationCount });

      // Snapshot previous values
      const previousNotifications = queryClient.getQueryData<NotificationData[]>(queryKeys.notifications);
      const previousCount = queryClient.getQueryData<number>(queryKeys.notificationCount);

      // Optimistically update notifications list
      if (previousNotifications) {
        const idsToUpdate = variables.id.map(String);
        queryClient.setQueryData<NotificationData[]>(
          queryKeys.notifications,
          previousNotifications.map((notif) =>
            idsToUpdate.includes(String(notif.id))
              ? { ...notif, is_read: variables.is_read }
              : notif
          )
        );
      }

      // Optimistically update count
      if (typeof previousCount === 'number' && variables.is_read) {
        const decrement = variables.id.length;
        queryClient.setQueryData<number>(
          queryKeys.notificationCount,
          Math.max(0, previousCount - decrement)
        );
      }

      return { previousNotifications, previousCount };
    },
    onError: (_error: Error, _variables, context) => {
      // Rollback on error
      if (context?.previousNotifications) {
        queryClient.setQueryData(queryKeys.notifications, context.previousNotifications);
      }
      if (typeof context?.previousCount === 'number') {
        queryClient.setQueryData(queryKeys.notificationCount, context.previousCount);
      }
    },
    onSuccess: () => {
      // Invalidate to ensure consistency
      invalidateOnNotificationChange(queryClient);
    },
  });
}

/**
 * Mutation hook for clearing/dismissing notifications with optimistic removal.
 */
export function useClearNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clearNotification,
    onMutate: async (variables: ClearNotificationParams) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.notifications });
      await queryClient.cancelQueries({ queryKey: queryKeys.notificationCount });

      // Snapshot previous values
      const previousNotifications = queryClient.getQueryData<NotificationData[]>(queryKeys.notifications);
      const previousCount = queryClient.getQueryData<number>(queryKeys.notificationCount);

      // Optimistically remove notifications from list
      if (previousNotifications) {
        const idsToRemove = variables.id.map(String);
        const updatedList = previousNotifications.filter(
          (notif) => !idsToRemove.includes(String(notif.id))
        );
        queryClient.setQueryData<NotificationData[]>(queryKeys.notifications, updatedList);

        // Also update the count based on how many unread we're removing
        if (typeof previousCount === 'number') {
          const unreadBeingRemoved = previousNotifications.filter(
            (notif) => idsToRemove.includes(String(notif.id)) && notif.is_read === false
          ).length;
          queryClient.setQueryData<number>(
            queryKeys.notificationCount,
            Math.max(0, previousCount - unreadBeingRemoved)
          );
        }
      }

      return { previousNotifications, previousCount };
    },
    onError: (_error: Error, _variables, context) => {
      // Rollback on error
      if (context?.previousNotifications) {
        queryClient.setQueryData(queryKeys.notifications, context.previousNotifications);
      }
      if (typeof context?.previousCount === 'number') {
        queryClient.setQueryData(queryKeys.notificationCount, context.previousCount);
      }
    },
    onSuccess: () => {
      // Invalidate to ensure consistency
      invalidateOnNotificationChange(queryClient);
    },
  });
}
