import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../lib/queryKeys';
import { staleTimeConfig } from '../../lib/staleTimeConfig';
import { invalidateOnEventChange } from '../../lib/invalidationMap';
import {
  fetchCalendarEvents,
  addEditEvent,
  addEditEventSilent,
  deleteEvent,
  updateEventStatus,
  CalendarEvent,
  AddEditEventParams,
  DeleteEventParams,
  UpdateEventStatusParams,
} from '../../api/events';
import { ts } from '../../Utility/Toaster';

/**
 * Hook to fetch and cache calendar events for given syllabus IDs.
 * 
 * Used on the Calendar page to display events for selected classes.
 * 
 * Features:
 * - Returns cached data instantly on subsequent visits
 * - Refetches in background when stale (1 min)
 * - Cache invalidated on event create/edit/delete
 * 
 * @param syllabusIds - Array of syllabus IDs to fetch events for
 * @param options - Optional query options
 * @example
 * const { data: events = [], isLoading } = useCalendarEvents(syllabusIds);
 */
export function useCalendarEvents(
  syllabusIds: (number | string)[],
  options?: { enabled?: boolean }
) {
  return useQuery<CalendarEvent[], Error>({
    queryKey: [...queryKeys.events, 'calendar', syllabusIds],
    queryFn: () => fetchCalendarEvents(syllabusIds),
    staleTime: staleTimeConfig.eventListing,
    enabled: options?.enabled !== false && syllabusIds.length > 0,
  });
}

/**
 * Mutation hook for creating/editing events.
 */
export function useAddEditEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addEditEvent,
    onSuccess: (data, variables) => {
      // Show success toast
      ts(variables.event_id ? 'Event updated successfully' : 'Event created successfully');
      // Invalidate related caches
      invalidateOnEventChange(queryClient);
    },
    onError: (error: Error) => {
      ts(error.message || 'Failed to save event');
    },
  });
}

/**
 * Mutation hook for silently updating events (drag-and-drop).
 * No toast notifications.
 */
export function useAddEditEventSilent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addEditEventSilent,
    onError: (error: Error) => {
      console.error('Failed to update event:', error);
    },
    onSettled: () => {
      // Always invalidate on settle to ensure cache is fresh
      invalidateOnEventChange(queryClient);
    },
  });
}

/**
 * Mutation hook for deleting events with optimistic updates.
 */
export function useDeleteEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      ts('Event deleted successfully');
      invalidateOnEventChange(queryClient);
    },
    onError: (error: Error) => {
      ts(error.message || 'Failed to delete event');
    },
  });
}

/**
 * Mutation hook for updating event status.
 */
export function useUpdateEventStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateEventStatus,
    onSuccess: () => {
      ts('Event status updated');
      invalidateOnEventChange(queryClient);
    },
    onError: (error: Error) => {
      ts(error.message || 'Failed to update event status');
    },
  });
}
