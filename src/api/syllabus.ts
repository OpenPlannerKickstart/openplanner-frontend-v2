import { get } from '../Utility/httpInterceptor';
import { GET_SYLLABUS_DROPDOWN_API } from '../Utility/ApiList';

/**
 * Syllabus/Course item from the dropdown API
 */
export interface SyllabusDropdownItem {
  id?: string | number;
  value?: string | number;
  syllabus_id?: string | number;
  syllabusId?: string | number;
  course_id?: string | number;
  courseId?: string | number;
  label?: string;
  name?: string;
  color?: string;
  [key: string]: any; // Allow additional properties
}

/**
 * Fetch syllabus dropdown data (list of courses/syllabi for filtering)
 * 
 * @returns Array of syllabus items
 * @throws Error if the API returns an error
 */
export const fetchSyllabusDropdown = async (): Promise<SyllabusDropdownItem[]> => {
  const response: any = await get(GET_SYLLABUS_DROPDOWN_API);
  
  if (response.data.error) {
    throw new Error(response.data.message || 'Failed to fetch syllabus dropdown');
  }
  
  return response.data.data || [];
};
