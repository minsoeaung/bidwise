import { Link, useSearchParams } from "react-router-dom";
import { usePaginatedAuctions } from "../../hooks/queries/usePaginatedAuctions";
import {
  Box,
  Button,
  Center,
  Flex,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Fallback } from "../../components/Fallback";
import AntdSpin from "../../components/AntdSpin";
import { ErrorDisplay } from "../../components/ErrorDisplay";
import { ApiError } from "../../types/ApiError";
import { ItemCard, ItemGrid } from "../../components/ItemCard";
import { AuctionPageOrderBy } from "@/types/AuctionPageOrder";
import { useEffect, useState } from "react";
import { NoDataYet } from "@/components/NoDataYet";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "@/components/ui/pagination";

const AuctionsPage = () => {
  const [params, setParams] = useSearchParams();
  const [orderBy, setOrderBy] = useState<AuctionPageOrderBy | "">(
    (params.get("OrderBy") || "") as AuctionPageOrderBy
  );

  const { data, isLoading, isFetching, isError, error, refetch } =
    usePaginatedAuctions(params.toString());

  const handlePageOrderChange = (orderBy: AuctionPageOrderBy) => () => {
    const newParams = new URLSearchParams(params);
    newParams.set("OrderBy", String(orderBy));
    setParams(newParams);
    setOrderBy(orderBy);
  };

  const handlePageNumberChange = (page: number) => {
    const newParams = new URLSearchParams(params);
    newParams.set("PageNumber", String(page));
    setParams(newParams);
  };

  const searchTerm = params.get("SearchTerm") || "";
  const isVickrey = params.get("Type") === "Vickrey";
  const isPast = params.get("Status") === "Ended";

  useEffect(() => {
    refetch();
  }, [params]);

  return (
    <Box maxW="8xl" mx="auto" px={{ base: "2", md: "8", lg: "12" }}>
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
              <VStack alignItems="baseline">
                <Text fontWeight="bold" fontSize="1rem">
                  {searchTerm}
                </Text>
              </VStack>
            )}

            <HStack justifyContent="space-between">
              <Text fontWeight="bold" fontSize="1.2rem">
                {isVickrey && "Vickrey Auctions"}
                {isPast && "Past Results"}{" "}
                {!!searchTerm && `Auctions (${data.content.length})`}
              </Text>
              <Flex>
                <Button
                  asChild
                  variant="plain"
                  onClick={handlePageOrderChange("EndingSoon")}
                >
                  <Text
                    fontSize="sm"
                    textDecoration={orderBy === "EndingSoon" ? "underline" : ""}
                    fontWeight={orderBy === "EndingSoon" ? "normal" : "lighter"}
                    color={orderBy === "EndingSoon" ? "" : "gray.500"}
                    textUnderlineOffset="8px"
                  >
                    Ending Soon
                  </Text>
                </Button>
                <Button
                  asChild
                  variant="plain"
                  onClick={handlePageOrderChange("NewlyListed")}
                >
                  <Text
                    fontSize="sm"
                    textDecoration={
                      orderBy === "" ||
                      orderBy === "SimpleOrder" ||
                      orderBy === "NewlyListed"
                        ? "underline"
                        : ""
                    }
                    textUnderlineOffset={
                      orderBy === "" ||
                      orderBy === "SimpleOrder" ||
                      orderBy === "NewlyListed"
                        ? "8px"
                        : ""
                    }
                    fontWeight={
                      orderBy === "" ||
                      orderBy === "SimpleOrder" ||
                      orderBy === "NewlyListed"
                        ? "normal"
                        : "lighter"
                    }
                    color={
                      orderBy === "" ||
                      orderBy === "SimpleOrder" ||
                      orderBy === "NewlyListed"
                        ? ""
                        : "gray.500"
                    }
                  >
                    Newly Listed
                  </Text>
                </Button>
              </Flex>
            </HStack>

            {data.content.length === 0 && (
              <Box mt={10}>
                <NoDataYet
                  type="results"
                  suggestions={[
                    "Try removing filters",
                    "Try different keywords",
                    "Try different auction types",
                  ]}
                />
              </Box>
            )}

            <ItemGrid mt={4}>
              {data.content.map((auction) => (
                <Link to={`/auctions/${auction.id}`} key={auction.id}>
                  <ItemCard auction={auction} />
                </Link>
              ))}
            </ItemGrid>
            <Center mt={10}>
              <PaginationRoot
                page={data.pageable.pageNumber}
                pageSize={data.pageable.pageSize}
                count={data.size}
                onPageChange={(e) => handlePageNumberChange(e.page)}
              >
                <HStack>
                  <PaginationPrevTrigger />
                  <PaginationItems />
                  <PaginationNextTrigger />
                </HStack>
              </PaginationRoot>
            </Center>
          </>
        )
      )}
    </Box>
  );
};

export default AuctionsPage;
