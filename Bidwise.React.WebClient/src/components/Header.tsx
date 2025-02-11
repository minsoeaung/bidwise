import {
  Box,
  Button,
  createListCollection,
  HStack,
  Input,
  Kbd,
  Stack,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { InputGroup } from "./ui/input-group";
import { LuSearch } from "react-icons/lu";
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "./ui/select";
import { useCategories } from "../hooks/queries/useCategories";

const Header = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [categories, setCategories] = useState(
    searchParams.get("Categories") || ""
  );

  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("SearchTerm") || ""
  );

  const { loggedInUser, logoutUrl } = useAuth();
  const { data: categoriesData } = useCategories();

  const categoryList = useMemo(() => {
    return createListCollection({
      items: categoriesData || [],
      itemToString: (item) => item.name,
      itemToValue: (item) => item.name,
    });
  }, [categoriesData]);

  const navigate = useNavigate();

  useEffect(() => {
    const searchTerm = searchParams.get("SearchTerm");
    if (!searchTerm) setSearchTerm("");

    const categories = searchParams.get("Categories");
    if (!categories) setCategories("");
  }, [searchParams]);

  const filterByName = () => {
    searchParams.set("SearchTerm", searchTerm);
    setSearchParams(searchParams);
    navigate({
      pathname: "/auctions",
      search: searchParams.toString(),
    });
  };

  const filterByCategory = (category: string) => {
    searchParams.set("Categories", category);
    setCategories(category);
    navigate({
      pathname: "/auctions",
      search: searchParams.toString(),
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      filterByName();
    }
  };

  const clearSearch = () => {
    searchParams.delete("SearchTerm");
    setSearchParams(searchParams);
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
      <HStack alignItems={"center"} justifyContent={"space-between"}>
        <Link to="/" style={{ fontWeight: "bold" }}>
          Logo
        </Link>
        <HStack>
          <InputGroup
            startElement={<LuSearch />}
            endElement={
              <SelectRoot
                collection={categoryList}
                variant="subtle"
                size="sm"
                width="130px"
                value={[categories]}
                onValueChange={(e) => {
                  const cat = e.value[0];
                  filterByCategory(cat);
                }}
              >
                <SelectTrigger>
                  <SelectValueText placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  {categoryList.items.map((cat) => (
                    <SelectItem item={cat} key={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </SelectRoot>
            }
          >
            <Input
              maxW="3xl"
              minW="2xl"
              variant="subtle"
              placeholder="Search for anything"
              autoComplete="off"
              size="lg"
              fontSize="xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </InputGroup>
        </HStack>
        <HStack>
          <Stack direction="row" alignItems="center">
            {loggedInUser && (
              <Button asChild variant="outline">
                <Link to="/user-session">My Session</Link>
              </Button>
            )}
            <Button asChild>
              <a href={loggedInUser ? logoutUrl : "/bff/login"}>
                {loggedInUser ? "Logout" : "Login"}
              </a>
            </Button>
          </Stack>
        </HStack>
      </HStack>
      {/* <Modal open={open} onClose={onClose}>
        <ModalOverlay />
        <ModalContent mx={3}>
          <ModalBody p={0}>
            <InputGroup maxWidth={700} size="lg">
              <Input
                placeholder="What are you looking for?"
                autoComplete="off"
                value={searchTerm}
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
