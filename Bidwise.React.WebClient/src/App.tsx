import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import router from "./pages/router";
import { RouterProvider } from "react-router";
import { ColorModeProvider } from "@/components/ui/color-mode";
import { Provider } from "@/components/ui/provider";
import "./app.css";

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
      <Provider>
        <RouterProvider router={router} />
        <ColorModeProvider></ColorModeProvider>
      </Provider>
    </QueryClientProvider>
  );
}

export default App;
