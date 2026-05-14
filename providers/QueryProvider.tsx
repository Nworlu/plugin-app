import { ApiError } from "@/utils/api-client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Do not retry on 401 / 403 / 404
        if (
          error instanceof ApiError &&
          [401, 403, 404].includes(error.status)
        ) {
          return false;
        }
        return failureCount < 2;
      },
      staleTime: 1000 * 60 * 2, // 2 minutes
    },
    mutations: {
      retry: false,
    },
  },
});

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

export { queryClient };
