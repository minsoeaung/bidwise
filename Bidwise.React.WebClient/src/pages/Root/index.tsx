import { Alert, Box, Container, Flex, Theme } from "@chakra-ui/react";
import { AuthContextProvider } from "../../context/AuthContext";
import { Suspense } from "react";
import { Outlet } from "react-router";
import { Footer } from "../../components/Footer";
import { Fallback } from "../../components/Fallback";
import Header from "../../components/Header";
import { ErrorBoundary } from "react-error-boundary";
import { Toaster } from "@/components/ui/toaster";

// @ts-ignore
function fallbackRender({ error, resetErrorBoundary }) {
  // Call resetErrorBoundary() to reset the error boundary and retry the render.
  return (
    <Container maxW="8xl" mt={5}>
      <Alert.Root status="error">
        <Alert.Indicator />
        <Alert.Content>
          <Alert.Title>Something went wrong:</Alert.Title>
          <Alert.Description>{error.message}</Alert.Description>
        </Alert.Content>
      </Alert.Root>
    </Container>
  );
}

const Root = () => {
  return (
    <AuthContextProvider>
      <Theme colorPalette="teal">
        <Flex minH="100vh" direction="column" flex="1">
          <Header />
          <Toaster />
          <Flex as="main" role="main" direction="column" flex="1">
            <Box role="presentation" px={3} minH="lg">
              <Suspense fallback={<Fallback />}>
                <ErrorBoundary fallbackRender={fallbackRender}>
                  <Outlet />
                </ErrorBoundary>
              </Suspense>
            </Box>
          </Flex>
          <Footer />
        </Flex>
      </Theme>
    </AuthContextProvider>
  );
};

export default Root;
