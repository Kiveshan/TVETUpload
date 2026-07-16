import { QueryClient } from '@tanstack/react-query';

// Shared React Query client. Defaults are conservative; tune per-query as needed.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
