import {
  Box,
  Button,
  createListCollection,
  Heading,
  HStack,
  Input,
  MenuContent,
  MenuItem,
  MenuItemGroup,
  MenuRoot,
  MenuSeparator,
  MenuTrigger,
  Stack,
  Avatar,
  Text,
  defineStyle,
} from "@chakra-ui/react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
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
import { ColorModeButton } from "./ui/color-mode";
import { useAuth } from "@/context/AuthContext";

const BidwiseLogo = "<Bidwise Logo>";

const ringCss = defineStyle({
  outlineWidth: "2px",
  outlineColor: "colorPalette.500",
  outlineOffset: "2px",
  outlineStyle: "solid",
});

const Header = () => {
  const { userName } = useAuth();

  const [searchParams, setSearchParams] = useSearchParams();

  const [categories, setCategories] = useState(
    searchParams.get("Categories") || ""
  );

  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("SearchTerm") || ""
  );

  const { logoutUrl } = useAuth();
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
    setSearchTerm(searchTerm || "");

    const categories = searchParams.get("Categories");
    setCategories(categories || "");
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
      minH={12}
      py={{ base: 1, md: 3 }}
      px={{ base: 3, md: 5 }}
      style={{
        borderBottomWidth: "1px",
        borderBottomColor: "grey.800",
        position: "sticky",
        top: 0,
        zIndex: 5,
      }}
      backgroundColor="white"
      _dark={{ backgroundColor: "black" }}
    >
      <HStack alignItems={"center"} justifyContent={"space-between"}>
        <HStack gap="1rem">
          <Link to="/">
            <Heading lineHeight="tall" fontWeight="bold">
              {BidwiseLogo}
            </Heading>
          </Link>
          <HStack gap="4px">
            <Box position="relative">
              <MenuRoot positioning={{ placement: "left-start" }}>
                <MenuTrigger asChild>
                  <Button variant="plain">Auctions</Button>
                </MenuTrigger>
                <MenuContent position="absolute" left="0px" width="150px">
                  <MenuItem value="all-auctions" asChild>
                    <Link to="/auctions?Status=All">All Auctions</Link>
                  </MenuItem>
                  <MenuItem value="vickrey-auctions" asChild>
                    <Link to="/auctions?Type=Vickrey">Vickrey Auctions</Link>
                  </MenuItem>
                  <MenuItem value="past-results">
                    <Link to="/auctions?Status=Ended">Past Results</Link>
                  </MenuItem>
                </MenuContent>
              </MenuRoot>
            </Box>
            <Button asChild borderRadius="3xl">
              <Link to="/auctions/create">Sell an item</Link>
            </Button>
            <Button asChild variant="plain">
              <Link to="/whatis">What's Bidwise?</Link>
            </Button>
          </HStack>
        </HStack>

        <Stack direction="row" alignItems="center">
          <HStack mr={5}>
            <InputGroup
              startElement={<LuSearch />}
              endElement={
                <SelectRoot
                  collection={categoryList}
                  variant="subtle"
                  width="130px"
                  size="sm"
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
                width="lg"
                variant="subtle"
                placeholder="Search for anything"
                autoComplete="off"
                fontSize="md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </InputGroup>
          </HStack>
          <ColorModeButton />
          {!userName ? (
            <Button asChild>
              <a href={"/bff/login"}>Login</a>
            </Button>
          ) : (
            <Box position="relative">
              <MenuRoot positioning={{ placement: "left-end" }}>
                <MenuTrigger asChild>
                  <Button variant="plain">
                    <HStack>
                      <Text>{userName}</Text>
                      <Avatar.Root>
                        <Avatar.Fallback />
                        <Avatar.Image src="https://bit.ly/broken-link" />
                      </Avatar.Root>
                    </HStack>
                  </Button>
                </MenuTrigger>
                <MenuContent position="absolute" left="-100px" width="150px">
                  <MenuItemGroup>
                    <MenuItem asChild value="profile">
                      <Link
                        to="https://localhost:5001/Identity/Account/Manage"
                        target="_blank"
                      >
                        Manage Account
                      </Link>
                    </MenuItem>
                    <MenuItem asChild value="my-session">
                      <Link to={`/account/session`}>My Session</Link>
                    </MenuItem>
                    <MenuItem asChild value="my-listings">
                      <Link to={`/account/listings`}>My Listings</Link>
                    </MenuItem>
                    <MenuItem asChild value="buyer-dashboard">
                      <Link to={`/account/bids`}>My Bids</Link>
                    </MenuItem>
                  </MenuItemGroup>
                  <MenuSeparator />
                  <MenuItemGroup title="Align">
                    <MenuItem asChild value="sign-out">
                      <a href={logoutUrl}>Sign Out</a>
                    </MenuItem>
                  </MenuItemGroup>
                </MenuContent>
              </MenuRoot>
            </Box>
          )}
        </Stack>
      </HStack>
    </Box>
  );
};

export default Header;
