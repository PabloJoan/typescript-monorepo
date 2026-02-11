import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { trpc } from "./trpc";
import { useAuthStore } from "./store/useAuthStore";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { CircularProgress } from "@mui/material";

// Create a new router instance
const router = createRouter({
  routeTree,
  context: {
    auth: { isAuthenticated: false },
  },
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Register {
    router: typeof router;
  }
}

function AuthWrapper() {
  const {
    data: session,
    isLoading,
    isFetching,
  } = trpc.auth.checkSession.useQuery(undefined, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: false,
  });

  if (isLoading || isFetching) {
    return <CircularProgress />;
  }

  const auth = { isAuthenticated: !!session?.authenticated };
  return <RouterProvider router={router} context={{ auth }} />;
}

export function App() {
  const [queryClient] = useState(() => new QueryClient());
  const token = useAuthStore((state) => state.token);
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: `${import.meta.env.VITE_BACKEND_URL}/trpc`,
          headers() {
            if (token) {
              return {
                Authorization: token,
              };
            }
            return {};
          },
        }),
      ],
    }),
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <AuthWrapper />
      </QueryClientProvider>
    </trpc.Provider>
  );
}
