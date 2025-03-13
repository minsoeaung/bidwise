import { Box, Stack, Text } from "@chakra-ui/react";
import { FaGithub } from "react-icons/fa";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <Box
      as="footer"
      role="contentinfo"
      justifySelf="end"
      minH={12}
      style={{
        borderTopWidth: "1px",
        borderTopColor: "grey.800",
        position: "sticky",
      }}
      backgroundColor="white"
      _dark={{ backgroundColor: "black" }}
    >
      <Stack
        direction="row"
        padding="2"
        justifyContent="center"
        alignItems="center"
      >
        <Text>© 2024-2025 Bidwise. All rights reserved.</Text>
        <Link target="_blank" to="https://github.com/minsoeaung/Bidwise">
          <FaGithub size={32} />
        </Link>
      </Stack>
    </Box>
  );
};
