import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import router from "./pages/router";
import { ChakraProvider, createSystem, defaultConfig } from "@chakra-ui/react";
import { RouterProvider } from "react-router";
import { ColorModeProvider } from "./components/ui/color-mode";

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

const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      fonts: {
        heading: { value: `'Figtree', sans-serif` },
        body: { value: `'Figtree', sans-serif` },
      },
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider>
        <RouterProvider router={router} />
      </Provider>
    </QueryClientProvider>
  );
}

function Provider(props) {
  return (
    <ChakraProvider value={system}>
      <ColorModeProvider {...props} />
    </ChakraProvider>
  );
}

export default App;
