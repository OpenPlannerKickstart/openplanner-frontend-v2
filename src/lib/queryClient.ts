import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,      // 5 minutes - data considered fresh
      gcTime: 30 * 60 * 1000,        // 30 minutes - keep in cache
      refetchOnWindowFocus: false,   // Don't refetch on tab focus
      refetchOnMount: false,         // Render cache immediately, don't block
      refetchOnReconnect: true,      // Quietly refresh after network reconnects
      retry: 1,                      // Retry failed requests once
    },
  },
});
