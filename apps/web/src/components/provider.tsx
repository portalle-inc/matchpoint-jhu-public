"use client";

import { useState } from "react";
import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { httpBatchLink } from "@trpc/client";
import { trpc } from "@/utils/trpc";
import { getTokens } from "@/utils/local-storage";
import { UserProvider } from "@/utils/user";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient, setQueryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // With SSR, we usually want to set some default staleTime
            // above 0 to avoid refetching immediately on the client
            staleTime: 60 * 1000,
          },
        },
      })
  );

  const [trpcClient, setTrpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: `http://localhost:8080/v2`,
          // headers need to be dynamic
          // so client side update of authentication status
          // is immediately reflected instead of waiting for
          // a full page reload
          headers: () => ({
            authorization: getTokens().access
              ? `bearer ${getTokens().access}`
              : undefined,
          }),
        }),
      ],
    })
  );
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {/* <ReactQueryStreamedHydration> */}
        <UserProvider>
          <CacheProvider>
            <ChakraProvider
              toastOptions={{
                defaultOptions: {
                  position:
                    process.env.NODE_ENV === "development" ? "top" : undefined,
                },
              }}
            >
              {children}
            </ChakraProvider>
            <ReactQueryDevtools />
          </CacheProvider>
        </UserProvider>
        {/* </ReactQueryStreamedHydration> */}
      </QueryClientProvider>
    </trpc.Provider>
  );
}
