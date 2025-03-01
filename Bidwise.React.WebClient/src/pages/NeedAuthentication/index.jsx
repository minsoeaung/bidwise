import { Box, Button, Heading, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const NeedAuthenticationPage = () => {
  return (
    <Box textAlign="center" py={10} px={6}>
      <Heading
        display="inline-block"
        as="h2"
        size="2xl"
        bgGradient="linear(to-r, teal.400, teal.600)"
        backgroundClip="text"
      >
        401
      </Heading>
      <Text fontSize="18px" mt={3} mb={2}>
        You need to sign in to continue.
      </Text>
      <Text color={"gray.500"} mb={6}>
        Access to this page is only available for signed-in users.
      </Text>

      <Button
        asChild
        colorScheme="blue"
        bgGradient="linear(to-r, teal.400, teal.500, teal.600)"
        color="white"
        variant="solid"
      >
        <Link to="/">Go to Home</Link>
      </Button>
    </Box>
  );
};

export default NeedAuthenticationPage;
