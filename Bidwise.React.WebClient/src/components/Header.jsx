import {
  Box,
  Button,
  Flex,
  Stack,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { FaMoon, FaSearch } from "react-icons/fa";

const Header = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filterValue, setFilterValue] = useState(
    searchParams.get("searchTerm") || ""
  );

  const { open, onClose, onOpen } = useDisclosure();

  const { loggedInUser, logoutUrl } = useAuth();

  const isMobile = useBreakpointValue({
    base: true,
    sm: true,
    xs: true,
    md: false,
  });

  const navigate = useNavigate();

  const search = () => {
    searchParams.set("filterValue", filterValue);
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
            spaceX={{ base: 1, md: 2 }}
            spaceY={{ base: 1, md: 2 }}
            alignItems="center"
          >
            <Button
              aria-label="Show search"
              variant="ghost"
              colorScheme={open ? "blue" : "gray"}
              onClick={onOpen}
            >
              <FaSearch />
            </Button>
            <Button aria-label="Color mode" variant="ghost" onClick={() => {}}>
              <FaMoon />
            </Button>
            <Button
              asChild
              as={Link}
              variant="outline"
              colorScheme="blue"
              size={{ base: "sm", md: "md" }}
            >
              <Link to="/user-session">User Session</Link>
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
      {/* <Modal open={open} onClose={onClose}>
        <ModalOverlay />
        <ModalContent mx={3}>
          <ModalBody p={0}>
            <InputGroup maxWidth={700} size="lg">
              <Input
                placeholder="What are you looking for?"
                autoComplete="off"
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                fontSize="xl"
              />
              <InputRightElement>
                <IconButton
                  aria-label="Search"
                  icon={<ArrowRight />}
                  size="lg"
                  variant="link"
                  colorScheme="blue"
                  onClick={search}
                />
              </InputRightElement>
            </InputGroup>
          </ModalBody>
        </ModalContent>
      </Modal> */}
    </Box>
  );
};

export default Header;
