import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../../lib/queryKeys';
import { staleTimeConfig } from '../../lib/staleTimeConfig';
import { fetchUser, UserData } from '../../api/user';

/**
 * Hook to fetch and cache current user data.
 * 
 * Used across the app for:
 * - Header/navigation user info
 * - Profile settings
 * - User avatar display
 * 
 * Features:
 * - Returns cached data instantly on subsequent calls
 * - Refetches in background when stale (5 min)
 * - Shared across all components using this hook
 * 
 * @example
 * const { data: userData, isLoading } = useUser();
 */
export function useUser() {
  return useQuery<UserData, Error>({
    queryKey: queryKeys.user,
    queryFn: fetchUser,
    staleTime: staleTimeConfig.user,
  });
}
