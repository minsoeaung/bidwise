import { Box, Flex } from "@chakra-ui/react";
import { AuthContextProvider } from "../../context/AuthContext";
import Header from "../../components/Header";
import { Suspense } from "react";
import { Outlet } from "react-router";
import { Footer } from "../../components/Footer";
import { Fallback } from "../../components/Fallback";
import { useColorModeValue } from "../../components/ui/color-mode";

const Root = () => {
  return (
    <AuthContextProvider>
      <Flex minH="100vh" direction="column" flex="1">
        <Header />
        <Flex
          as="main"
          role="main"
          direction="column"
          flex="1"
          bgColor={useColorModeValue("gray.100", "gray.900")}
        >
          <Box
            role="presentation"
            py={3}
            px={3}
            minH="lg"
            bg="bg.accent.default"
          >
            <Suspense fallback={<Fallback />}>
              <Outlet />
            </Suspense>
          </Box>
        </Flex>
        <Footer />
      </Flex>
    </AuthContextProvider>
  );
};

export default Root;
