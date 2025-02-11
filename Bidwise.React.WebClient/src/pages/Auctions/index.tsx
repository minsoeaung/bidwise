import { Link, useSearchParams } from "react-router-dom";
import { usePaginatedAuctions } from "../../hooks/queries/usePaginatedAuctions";
import {
  Box,
  Button,
  HStack,
  Icon,
  List,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Fallback } from "../../components/Fallback";
import AntdSpin from "../../components/AntdSpin";
import { ErrorDisplay } from "../../components/ErrorDisplay";
import { ApiError } from "../../types/ApiError";
import { FaSearch } from "react-icons/fa";
import { useEffect } from "react";
import { ApiClient } from "../../api/apiClient";

const AuctionsPage = () => {
  const [params, setParams] = useSearchParams();

  const { data, isLoading, isFetching, isError, error } = usePaginatedAuctions(
    params.toString()
  );

  const handlePageChange = (page) => {
    const newParams = new URLSearchParams(params);
    newParams.set("pageNum", String(page));
    setParams(newParams);
  };

  const searchTerm = params.get("SearchTerm") || "";

  const clearFilterValue = () => {
    params.delete("filterValue");
    setParams(params);
  };

  useEffect(() => {
    ApiClient.get("api/bids/public");
    ApiClient.get("api/bids/private");
  }, []);

  return (
    <Box maxW="7xl" mx="auto" px={{ base: "2", md: "8", lg: "12" }}>
      {isFetching && !isLoading && <Fallback />}
      {isLoading ? (
        <Box mt={10}>
          <AntdSpin />
        </Box>
      ) : isError ? (
        <ErrorDisplay error={error as ApiError} />
      ) : (
        data && (
          <>
            {!!searchTerm && (
              <HStack alignItems="baseline">
                <Text
                  fontWeight="bold"
                  fontSize={{ base: "1rem", md: "1.4rem" }}
                >
                  Search Results for '{searchTerm}'
                </Text>
              </HStack>
            )}
            <Button asChild>
              <Link to="/auctions/create">Create Auction</Link>
            </Button>
            {data.content.length === 0 && (
              <Box mt={10}>
                <VStack>
                  <FaSearch fontSize="5xl" />
                  <Text>No Auctions Found!</Text>
                </VStack>
              </Box>
            )}
            <List.Root>
              {data.content.map((auction) => (
                <List.Item key={auction.id}>
                  <Link to={`/auctions/${auction.id}`}>{auction.name}</Link>
                </List.Item>
              ))}
            </List.Root>
          </>
        )
      )}
    </Box>
  );
};

export default AuctionsPage;
