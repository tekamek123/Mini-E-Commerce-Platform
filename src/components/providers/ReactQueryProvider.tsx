'use client';

import { QueryClient, QueryClientProvider, QueryCache, MutationCache } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';

export function ReactQueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (error) => {
            // Only trigger toast for queries if not manually handled, or always standardized
            toast.error(error.message || 'Failed to fetch storefront data');
          },
        }),
        mutationCache: new MutationCache({
          onError: (error) => {
            toast.error(error.message || 'Operation failed. Please try again.');
          },
        }),
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
