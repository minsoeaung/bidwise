import {
  Box,
  Button,
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Stack,
  useBreakpointValue,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";
import {
  ArrowRightIcon,
  MoonIcon,
  SearchIcon,
  SunIcon,
} from "@chakra-ui/icons";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInputValue, setSearchInputValue] = useState(
    searchParams.get("searchTerm") || ""
  );

  const { isOpen, onClose, onOpen } = useDisclosure();

  const { loggedInUser, logoutUrl } = useAuth();

  const isMobile = useBreakpointValue({
    base: true,
    sm: true,
    xs: true,
    md: false,
  });

  const navigate = useNavigate();

  const search = () => {
    searchParams.set("searchTerm", searchInputValue);
    setSearchParams(searchParams);
    navigate({
      pathname: "/auctions",
      search: searchParams.toString(),
    });
    onClose();
  };

  return (
    <Box
      as="nav"
      role="navigation"
      bg="bg.accent.default"
      minH={12}
      py={{ base: 1, md: 3 }}
      px={{ base: 3, md: 5 }}
      style={{
        borderBottomStyle: "solid",
        borderBottomWidth: "0.8px",
        borderBottomColor: "gray.200",
      }}
    >
      <Flex h={12} alignItems={"center"} justifyContent={"space-between"}>
        <Link to="/auctions">{isMobile ? <Box pr={5}>Logo</Box> : "Logo"}</Link>
        <Flex alignItems="center">
          <Stack
            direction="row"
            spacing={{ base: 1, md: 2 }}
            alignItems="center"
          >
            <IconButton
              aria-label="Show search"
              variant="ghost"
              colorScheme={isOpen ? "blue" : "gray"}
              icon={<SearchIcon />}
              onClick={onOpen}
            />
            <IconButton
              aria-label="Color mode"
              variant="ghost"
              icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
              onClick={toggleColorMode}
            />

            <Button
              as={Link}
              to="/user-session"
              variant="outline"
              colorScheme="blue"
              size={{ base: "sm", md: "md" }}
            >
              Session
            </Button>
            <Button as="a">
              <a
                className="text-dark nav-link"
                href={loggedInUser ? logoutUrl : "/bff/login"}
              >
                {loggedInUser ? "Logout" : "Login"}
              </a>
            </Button>
          </Stack>
        </Flex>
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent mx={3}>
          <ModalBody p={0}>
            <InputGroup maxWidth={700} size="lg">
              <Input
                placeholder="What are you looking for?"
                autoComplete="off"
                value={searchInputValue}
                onChange={(e) => setSearchInputValue(e.target.value)}
                fontSize="xl"
              />
              <InputRightElement>
                <IconButton
                  aria-label="Search"
                  icon={<ArrowRightIcon />}
                  size="lg"
                  variant="link"
                  colorScheme="blue"
                  onClick={search}
                />
              </InputRightElement>
            </InputGroup>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Header;
