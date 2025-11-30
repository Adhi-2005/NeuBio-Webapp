import { QueryClient, QueryFunction } from "@tanstack/react-query";

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  console.log(`[MOCK API] ${method} ${url}`, data);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  let responseData: any = { success: true };

  if (url.includes("/login") || url.includes("/register")) {
    responseData = {
      user: {
        id: "mock-user-id",
        email: (data as any)?.email || "test@example.com",
        firstName: "Test",
        lastName: "User",
      }
    };
  }

  // Return a mock success response
  return new Response(JSON.stringify(responseData), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export const getQueryFn: <T>(options: {
  on401: "returnNull" | "throw";
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    console.log(`[MOCK QUERY] ${queryKey.join("/")}`);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Return mock data based on the query key if needed, or just an empty object/array
    // For now, returning null or empty object is safer than throwing
    return {} as any;
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});

