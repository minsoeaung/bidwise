import {
  Box,
  IconButton,
  Stack,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { FaGithub } from "react-icons/fa";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <Box
      as="footer"
      role="contentinfo"
      bg="bg.accent.default"
      color={useColorModeValue("gray.700", "gray.200")}
      justifySelf="end"
    >
      <Box
        as={Stack}
        py={4}
        px={4}
        direction={{ base: "column", md: "row" }}
        spacing={4}
        justify={{ base: "center", md: "space-between" }}
        align={{ base: "center", md: "center" }}
      >
        Logo
        <VStack align="start" spacing={0}>
          <Text>
            © {new Date().getFullYear()} Bidwise. All rights reserved.
          </Text>
        </VStack>
        <Stack direction={"row"} spacing={6}>
          <IconButton
            as={Link}
            to="https://github.com/minsoeaung/Bidwise"
            target="_blank"
            isRound
            variant="solid"
            colorScheme="linkedin"
            aria-label="Github link"
            icon={<FaGithub />}
          />
        </Stack>
      </Box>
    </Box>
  );
};
