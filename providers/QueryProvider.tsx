import { ApiError } from "@/utils/api-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import React from "react";

const AUTH_SENSITIVE_QUERY_ROOTS = new Set(["auth", "notifications"]);

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
      staleTime: 1000 * 60 * 5, // 5 minutes (increased for better offline use)
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
    },
    mutations: {
      retry: false,
    },
  },
});

const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: "OFFLINE_QUERY_CACHE",
});

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister: asyncStoragePersister,
        dehydrateOptions: {
          shouldDehydrateQuery: (query) => {
            const rootKey = String(query.queryKey[0] ?? "");
            if (AUTH_SENSITIVE_QUERY_ROOTS.has(rootKey)) {
              return false;
            }

            return query.state.status === "success";
          },
        },
      }}
    >
      {children}
    </PersistQueryClientProvider>
  );
}

export { queryClient };
