import { post } from '../Utility/httpInterceptor';
import {
  GET_CALENDER_DATA,
  ADD_EDIT_EVENT_DATA_API,
  DELETE_EVENT_DATA_API,
  UPDATE_EVENT_STATUS_DATA_API,
} from '../Utility/ApiList';

/**
 * Event data from the API
 */
export interface CalendarEvent {
  id?: number | string;
  title?: string;
  name?: string;
  note?: string;
  start_date?: string;
  end_date?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  priority?: string;
  syllabus_id?: number | string;
  course_color?: string;
  courseColor?: string;
  is_reminder?: boolean;
  reminder?: any[];
  is_all_day_event?: boolean;
  event_data?: any;
  [key: string]: any;
}

/**
 * Fetch calendar events for given syllabus IDs
 * 
 * @param syllabusIds - Array of syllabus IDs to fetch events for
 * @returns Array of calendar event objects
 * @throws Error if the API returns an error
 */
export const fetchCalendarEvents = async (syllabusIds: (number | string)[]): Promise<CalendarEvent[]> => {
  if (syllabusIds.length === 0) {
    return [];
  }
  
  const response: any = await post(GET_CALENDER_DATA, { syllabus_id: syllabusIds });
  
  if (response.data.error) {
    throw new Error(response.data.message || 'Failed to fetch calendar events');
  }
  
  return response.data.data || [];
};

/**
 * Create or update an event
 */
export interface AddEditEventParams {
  event_id?: number | string;
  syllabus_id?: number | string;
  title?: string;
  note?: string;
  start_date?: string;
  end_date?: string;
  is_reminder?: boolean;
  reminder?: any[];
  priority?: string;
  is_all_day_event?: boolean;
  [key: string]: any;
}

export const addEditEvent = async (params: AddEditEventParams): Promise<any> => {
  const response: any = await post(ADD_EDIT_EVENT_DATA_API, params);
  
  if (response.data.error) {
    throw new Error(response.data.message || 'Failed to save event');
  }
  
  return response.data.data;
};

/**
 * Add/edit event silently (for drag-and-drop operations)
 * No global loader, no toast
 */
export const addEditEventSilent = async (params: AddEditEventParams): Promise<any> => {
  const response: any = await post(ADD_EDIT_EVENT_DATA_API, params);
  
  if (response.data.error) {
    throw new Error(response.data.message || 'Failed to save event');
  }
  
  return response.data.data;
};

/**
 * Delete one or more events
 */
export interface DeleteEventParams {
  event_id: (number | string)[];
}

export const deleteEvent = async (params: DeleteEventParams): Promise<any> => {
  const response: any = await post(DELETE_EVENT_DATA_API, params);
  
  if (response.data.error) {
    throw new Error(response.data.message || 'Failed to delete event');
  }
  
  return response.data.data;
};

/**
 * Update event status
 */
export interface UpdateEventStatusParams {
  event_id: (number | string)[];
  status: string;
}

export const updateEventStatus = async (params: UpdateEventStatusParams): Promise<any> => {
  const response: any = await post(UPDATE_EVENT_STATUS_DATA_API, params);
  
  if (response.data.error) {
    throw new Error(response.data.message || 'Failed to update event status');
  }
  
  return response.data.data;
};
