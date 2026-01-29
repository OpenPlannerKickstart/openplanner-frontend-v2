import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../../lib/queryKeys';
import { staleTimeConfig } from '../../lib/staleTimeConfig';
import { fetchSyllabusDropdown, SyllabusDropdownItem } from '../../api/syllabus';

/**
 * Hook to fetch and cache syllabus dropdown data.
 * 
 * This data is used across multiple pages (Dashboard, Calendar, Courses, modals)
 * for course pills, filtering, and syllabus selection.
 * 
 * Features:
 * - Returns cached data instantly on subsequent calls
 * - Refetches in background when stale (2 min)
 * - Shared across all components using this hook
 * 
 * @example
 * const { data: syllabusData, isLoading, isFetching } = useSyllabusDropdown();
 */
export function useSyllabusDropdown() {
  return useQuery<SyllabusDropdownItem[], Error>({
    queryKey: queryKeys.syllabusDropdown,
    queryFn: fetchSyllabusDropdown,
    staleTime: staleTimeConfig.syllabusDropdown,
  });
}
