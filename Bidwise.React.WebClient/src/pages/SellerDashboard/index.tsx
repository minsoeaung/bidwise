import { NoDataYet } from "@/components/NoDataYet";
import { SomethingWentWrongAlert } from "@/components/SomethingWentWrongAlert";
import { TimeLeft } from "@/components/TimeLeft";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { SkeletonText } from "@/components/ui/skeleton";
import { useAuth } from "@/context/AuthContext";
import { useSellAuctions } from "@/hooks/queries/useSellAuctions";
import {
  Box,
  Table,
  Text,
  Heading,
  Separator,
  Badge,
  Status,
  FormatNumber,
  Flex,
  HStack,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { FaHourglass, FaRegClock, FaRegHourglass } from "react-icons/fa";
import { LuTable, LuList } from "react-icons/lu";
import { RiAuctionLine } from "react-icons/ri";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

type Params = {
  id: string;
};

const SellerDashboardPage = () => {
  const [filterValue, setFilterValue] = useState("All");

  const { userId } = useAuth();
  const { id } = useParams<Params>();
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();

  const apiInput = id ? Number(id) : userId;
  const { data, isLoading, isError } = useSellAuctions(apiInput);

  const isMine = apiInput === userId;
  const ownerName = params.get("UserName");

  const filteredData = useMemo(() => {
    if (Array.isArray(data)) {
      if (filterValue === "All") {
        return data;
      } else if (filterValue === "Running") {
        return data.filter((d) => d.status === "Available");
      } else if (filterValue === "Ended") {
        return data.filter((d) => ["Sold", "Expired"].includes(d.status));
      } else {
        return [];
      }
    }

    return [];
  }, [data, filterValue]);

  return (
    <Box maxW="8xl" mx="auto">
      <Flex justifyContent="space-between" alignItems="center" py={5}>
        <Heading>
          {isMine
            ? "My Auctions"
            : ownerName
            ? `${ownerName}'s Auctions`
            : "Listed Auctions"}
        </Heading>
        <SegmentedControl
          defaultValue="All"
          onValueChange={(e) => setFilterValue(e.value)}
          items={[
            {
              value: "All",
              label: "All",
            },
            {
              value: "Running",
              label: (
                <HStack>
                  <FaRegClock />
                  Running
                </HStack>
              ),
            },
            {
              value: "Ended",
              label: (
                <HStack>
                  <RiAuctionLine />
                  Ended
                </HStack>
              ),
            },
          ]}
        />
      </Flex>

      <Separator />
      <Box py={5}>
        {isLoading ? (
          <SkeletonText noOfLines={4} gap="4" />
        ) : isError ? (
          <SomethingWentWrongAlert />
        ) : (
          Array.isArray(data) &&
          (data.length > 0 ? (
            <Table.ScrollArea
              borderWidth="1px"
              rounded="md"
              maxHeight="calc(100vh - (65px + 120px + 48px + 16px))"
            >
              <Table.Root stickyHeader interactive>
                <Table.Header>
                  <Table.Row bg="bg.subtle">
                    <Table.ColumnHeader>Item</Table.ColumnHeader>
                    <Table.ColumnHeader>Result</Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="end">
                      Starting Bid
                    </Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="end">
                      Current Highest Bid
                    </Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="end">
                      Winner
                    </Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {filteredData.map((auction) => (
                    <Table.Row
                      key={auction.id}
                      cursor="pointer"
                      onClick={() => navigate(`/auctions/${auction.id}`)}
                    >
                      <Table.Cell>{auction.name}</Table.Cell>
                      <Table.Cell>
                        {auction.status === "Sold" && (
                          <Status.Root colorPalette="green">
                            <Status.Indicator />
                            Sold for{" "}
                            <FormatNumber
                              value={auction.buyerPayAmount!}
                              style="currency"
                              currency="USD"
                              maximumFractionDigits={0}
                            />
                          </Status.Root>
                        )}
                        {auction.status === "Expired" && (
                          <Status.Root colorPalette="red">
                            <Status.Indicator />
                            Expired
                          </Status.Root>
                        )}
                        {auction.status === "Available" && (
                          <Status.Root colorPalette="blue">
                            <Status.Indicator />
                            Running
                          </Status.Root>
                        )}
                      </Table.Cell>
                      <Table.Cell textAlign="end" pr={8}>
                        <FormatNumber
                          value={auction.startingBid}
                          style="currency"
                          currency="USD"
                          maximumFractionDigits={0}
                        />
                      </Table.Cell>
                      <Table.Cell textAlign="end" pr={8}>
                        {auction.currentHighestBid ? (
                          <FormatNumber
                            value={auction.currentHighestBid}
                            style="currency"
                            currency="USD"
                            maximumFractionDigits={0}
                          />
                        ) : (
                          "-"
                        )}
                      </Table.Cell>
                      <Table.Cell textAlign="end" pr={8}>
                        {auction.buyerName ? (
                          <Badge>{auction.buyerName}</Badge>
                        ) : auction.status === "Available" ? (
                          <Text color="fg.info">
                            To be determined in{" "}
                            <TimeLeft endDate={auction.endDate} />
                          </Text>
                        ) : (
                          "-"
                        )}
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Table.ScrollArea>
          ) : (
            <NoDataYet type="results" suggestions={["Try removing filters"]} />
          ))
        )}
      </Box>
    </Box>
  );
};

export default SellerDashboardPage;
