import { Link, useSearchParams } from "react-router-dom";
import { usePaginatedAuctions } from "../../hooks/queries/usePaginatedAuctions";
import { Box, Icon, List, Text, VStack } from "@chakra-ui/react";
import { Fallback } from "../../components/Fallback";
import AntdSpin from "../../components/AntdSpin";
import { ErrorDisplay } from "../../components/ErrorDisplay";
import { ApiError } from "../../types/ApiError";
import { FaSearch } from "react-icons/fa";

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

  const filterValue = params.get("filterValue") || "";

  const clearFilterValue = () => {
    params.delete("filterValue");
    setParams(params);
  };

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
            {data.data.length === 0 && (
              <Box mt={10}>
                <VStack>
                  <FaSearch fontSize="5xl" />
                  <Text>No Auctions Yet!</Text>
                </VStack>
              </Box>
            )}
            <List.Root>
              {data.data.map((auction) => (
                <List.Item>
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
