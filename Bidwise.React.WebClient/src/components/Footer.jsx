import { Box, Stack, Text, VStack } from "@chakra-ui/react";
import { FaGithub } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useColorModeValue } from "./ui/color-mode";

export const Footer = () => {
  return (
    <Box
      as="footer"
      role="contentinfo"
      bg="bg.accent.default"
      color={useColorModeValue("gray.700", "gray.200")}
      justifySelf="end"
    >
      <Stack
        direction="row"
        padding="2"
        justifyContent="center"
        alignItems="center"
      >
        Logo
        <VStack align="start" spaceX={0} spaceY={0}>
          <Text>
            © {new Date().getFullYear()} Bidwise. All rights reserved.
          </Text>
        </VStack>
        <Link target="_blank" to="https://github.com/minsoeaung/Bidwise">
          <FaGithub size={32} />
        </Link>
      </Stack>
    </Box>
  );
};
