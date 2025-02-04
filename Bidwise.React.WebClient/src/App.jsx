import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import router from "./pages/router";
import { ChakraProvider } from "@chakra-ui/react";
import { RouterProvider } from "react-router";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 60 * 1000 * 60, // 60 minutes
      retry: 0,
    },
    mutations: {
      retry: 0,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <RouterProvider router={router} />
      </ChakraProvider>
    </QueryClientProvider>
  );
}

export default App;

{
  /* <Routes>
<Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/user-session" element={<UserSession />} />
        <Route path="/call-api" element={<CallApi />} />
      </Route>
    </Routes> */
}
