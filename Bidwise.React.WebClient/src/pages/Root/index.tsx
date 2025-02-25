import { Alert, Box, Flex } from "@chakra-ui/react";
import { AuthContextProvider } from "../../context/AuthContext";
import { Suspense } from "react";
import { Outlet } from "react-router";
import { Footer } from "../../components/Footer";
import { Fallback } from "../../components/Fallback";
import { useColorModeValue } from "../../components/ui/color-mode";
import Header from "../../components/Header";
import { ErrorBoundary } from "react-error-boundary";

function fallbackRender({ error, resetErrorBoundary }) {
  // Call resetErrorBoundary() to reset the error boundary and retry the render.
  return (
    <Alert.Root status="error">
      <Alert.Indicator />
      <Alert.Content>
        <Alert.Title>Something went wrong:</Alert.Title>
        <Alert.Description>{error.message}</Alert.Description>
      </Alert.Content>
    </Alert.Root>
  );
}

const Root = () => {
  return (
    <AuthContextProvider>
      <Flex minH="100vh" direction="column" flex="1">
        <Header />
        <Flex as="main" role="main" direction="column" flex="1">
          <Box
            role="presentation"
            py={3}
            px={3}
            minH="lg"
            bg="bg.accent.default"
          >
            <Suspense fallback={<Fallback />}>
              <ErrorBoundary
                fallbackRender={fallbackRender}
                onReset={(details) => {
                  // Reset the state of your app so the error doesn't happen again
                }}
              >
                <Outlet />
              </ErrorBoundary>
            </Suspense>
          </Box>
        </Flex>
        <Footer />
      </Flex>
    </AuthContextProvider>
  );
};

export default Root;
