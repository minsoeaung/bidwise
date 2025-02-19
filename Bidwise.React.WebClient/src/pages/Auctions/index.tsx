import { Link, useSearchParams } from "react-router-dom";
import { usePaginatedAuctions } from "../../hooks/queries/usePaginatedAuctions";
import {
  Box,
  Button,
  Flex,
  HStack,
  List,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Fallback } from "../../components/Fallback";
import AntdSpin from "../../components/AntdSpin";
import { ErrorDisplay } from "../../components/ErrorDisplay";
import { ApiError } from "../../types/ApiError";
import { FaSearch } from "react-icons/fa";
import { ItemCard, ItemGrid } from "../../components/ItemCard";
import { AuctionPageOrderBy } from "@/types/AuctionPageOrder";
import { useEffect, useState } from "react";

const AuctionsPage = () => {
  const [params, setParams] = useSearchParams();
  const [orderBy, setOrderBy] = useState<AuctionPageOrderBy | "">(
    (params.get("OrderBy") || "") as AuctionPageOrderBy
  );

  const { data, isLoading, isFetching, isError, error } = usePaginatedAuctions(
    params.toString()
  );

  const handlePageOrderChange = (orderBy: AuctionPageOrderBy) => () => {
    const newParams = new URLSearchParams(params);
    newParams.set("OrderBy", String(orderBy));
    setParams(newParams);
    setOrderBy(orderBy);
  };

  const searchTerm = params.get("SearchTerm") || "";

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
                Auctions {!!searchTerm && `(${data.content.length})`}
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
                <VStack>
                  <FaSearch fontSize="5xl" />
                  <Text>No Auctions!</Text>
                </VStack>
              </Box>
            )}

            <ItemGrid mt={4}>
              {data.content.map((auction) => (
                <Link to={`/auctions/${auction.id}`} key={auction.id}>
                  <ItemCard auction={auction} />
                </Link>
              ))}
            </ItemGrid>
          </>
        )
      )}
    </Box>
  );
};

export default AuctionsPage;
