import { NoDataYet } from "@/components/NoDataYet";
import { SomethingWentWrongAlert } from "@/components/SomethingWentWrongAlert";
import { TimeLeft } from "@/components/TimeLeft";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { SkeletonText } from "@/components/ui/skeleton";
import { AUCTION_IMAGES } from "@/constants/fileUrls";
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
  VStack,
  Button,
  Avatar,
  AvatarGroup,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { FaRegClock } from "react-icons/fa";
import { RiArrowRightLine, RiAuctionLine } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import { TbEdit } from "react-icons/tb";
import { CgEye } from "react-icons/cg";

const MyListings = () => {
  const [filterValue, setFilterValue] = useState("All");

  const { userId } = useAuth();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useSellAuctions(userId);

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
    <Box maxW="7xl" mx="auto">
      <Flex justifyContent="space-between" alignItems="center">
        <Heading>My Listings</Heading>
        <HStack>
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
          <Button variant="outline" asChild>
            <Link to="/account/bids">
              View bids <RiArrowRightLine />
            </Link>
          </Button>
        </HStack>
      </Flex>

      <Separator my={5} />

      <Box>
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
              <Table.Root stickyHeader>
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
                    <Table.ColumnHeader textAlign="end">
                      Actions
                    </Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {filteredData.map((auction) => (
                    <Table.Row key={auction.id}>
                      <Table.Cell>
                        <HStack>
                          {!!auction.images.length && (
                            <AvatarGroup gap="0" spaceX="-3" size="xs">
                              <Avatar.Root>
                                <Avatar.Fallback
                                  name={auction.images[0].label || "item"}
                                />
                                <Avatar.Image
                                  src={AUCTION_IMAGES + auction.images[0].name}
                                />
                              </Avatar.Root>
                              {auction.images.length - 1 > 0 && (
                                <Avatar.Root variant="solid">
                                  <Avatar.Fallback>
                                    +{auction.images.length - 1}
                                  </Avatar.Fallback>
                                </Avatar.Root>
                              )}
                            </AvatarGroup>
                          )}
                          <Text>{auction.name}</Text>
                        </HStack>
                      </Table.Cell>
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
                      <Table.Cell textAlign="end">
                        <HStack justifyContent="end">
                          <Button
                            variant="ghost"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              navigate(`/auctions/${auction.id}`);
                            }}
                          >
                            <CgEye />
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              navigate(`/auctions/${auction.id}/edit`);
                            }}
                          >
                            <TbEdit />
                          </Button>
                        </HStack>
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

export default MyListings;
