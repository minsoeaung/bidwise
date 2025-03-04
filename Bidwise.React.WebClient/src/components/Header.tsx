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

export const headerHeight = 65;

const Header = () => {
  const { userName, userId } = useAuth();

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
      height={`${headerHeight}px`}
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      px={5}
      style={{
        borderBottomWidth: "1px",
        borderBottomColor: "grey.800",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
      backgroundColor="white"
      _dark={{ backgroundColor: "black" }}
    >
      <HStack gap="10px">
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
            <Link to="/auctions/create">Start an Auction</Link>
          </Button>
          <Button asChild variant="plain">
            <Link to="/whatis">What's Bidwise?</Link>
          </Button>
        </HStack>
      </HStack>
      <HStack alignItems={"center"}>
        <InputGroup
          startElement={<LuSearch />}
          mr={5}
          endElement={
            <SelectRoot
              collection={categoryList}
              variant="subtle"
              width="150px"
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
            width="md"
            variant="subtle"
            placeholder="Search for anything"
            autoComplete="off"
            fontSize="md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </InputGroup>
        <ColorModeButton />
        {!userName ? (
          <Button asChild>
            <a href={"/bff/login"}>Login</a>
          </Button>
        ) : (
          <Box position="relative" display="inline-block">
            <MenuRoot>
              <MenuTrigger asChild>
                <Button variant="plain">
                  <Avatar.Root>
                    <Avatar.Fallback name={userName} />
                    <Avatar.Image src="https://bit.ly/broken-link" />
                  </Avatar.Root>
                </Button>
              </MenuTrigger>
              <MenuContent position="absolute" left="-100px" width="150px">
                <MenuItemGroup>
                  <MenuItem asChild value="profile">
                    <Link to={`/users/${userId}?UserName=${userName}`}>
                      Profile
                    </Link>
                  </MenuItem>
                  <MenuItem asChild value="my-listings">
                    <Link to={`/account/listings`}>My Listings</Link>
                  </MenuItem>
                  <MenuItem asChild value="buyer-dashboard">
                    <Link to={`/account/bids`}>My Bids</Link>
                  </MenuItem>
                  <MenuSeparator />
                  <MenuItem asChild value="my-session">
                    <Link to={`/account/session`}>Session</Link>
                  </MenuItem>
                  <MenuItem asChild value="manage-account">
                    <Link
                      to="https://localhost:5001/Identity/Account/Manage"
                      target="_blank"
                    >
                      Account Settings
                    </Link>
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
      </HStack>
    </Box>
  );
};

export default Header;
