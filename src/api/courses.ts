import { post } from '../Utility/httpInterceptor';
import { GET_COURSES_LIST_DATA_API } from '../Utility/ApiList';

/**
 * Course data from the syllabusListing API
 */
export interface Course {
  id: number | string;
  title?: string;
  course_name?: string;
  course_color?: string;
  class_time?: string;
  class_time_display?: string;
  course_time?: string;
  classTime?: string;
  no_of_events?: number;
  events_count?: number;
  event_count?: number;
  eventsCount?: number;
  eventCount?: number;
  total_events?: number;
  totalEvents?: number;
  [key: string]: any;
}

/**
 * Fetch full courses list (syllabus listing)
 * 
 * This is different from syllabusDropdown - it returns complete course data
 * including event counts, class times, etc. for the Courses page display.
 * 
 * @returns Array of course objects
 * @throws Error if the API returns an error
 */
export const fetchCourses = async (): Promise<Course[]> => {
  const response: any = await post(GET_COURSES_LIST_DATA_API, {});
  
  if (response.data.error) {
    throw new Error(response.data.message || 'Failed to fetch courses');
  }
  
  return response.data.data || [];
};
