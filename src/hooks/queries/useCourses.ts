import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../../lib/queryKeys';
import { staleTimeConfig } from '../../lib/staleTimeConfig';
import { fetchCourses, Course } from '../../api/courses';

/**
 * Hook to fetch and cache the full courses list.
 * 
 * Used on the Courses page to display all syllabi with their
 * event counts, class times, colors, etc.
 * 
 * This is different from useSyllabusDropdown which fetches
 * lightweight data for filtering/dropdowns.
 * 
 * Features:
 * - Returns cached data instantly on subsequent visits
 * - Refetches in background when stale (5 min)
 * - Cache invalidated on syllabus create/edit/delete
 * 
 * @example
 * const { data: courses = [], isLoading, refetch } = useCourses();
 */
export function useCourses() {
  return useQuery<Course[], Error>({
    queryKey: queryKeys.courses,
    queryFn: fetchCourses,
    staleTime: staleTimeConfig.courses,
  });
}
