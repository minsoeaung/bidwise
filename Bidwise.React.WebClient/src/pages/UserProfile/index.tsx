import { useBuyAuctions } from "@/hooks/queries/useBuyAuctions";
import { useSellAuctions } from "@/hooks/queries/useSellAuctions";
import {
  Avatar,
  Box,
  Text,
  HStack,
  Stack,
  Heading,
  Tabs,
  SimpleGrid,
  Badge,
  Float,
  EmptyState,
  List,
  VStack,
  FormatNumber,
  Card,
} from "@chakra-ui/react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { pickAvatarColorPalette } from "@/utils/pickAvatarColorPalette";
import { SkeletonText } from "@/components/ui/skeleton";
import { ItemCard } from "@/components/ItemCard";
import { HiColorSwatch } from "react-icons/hi";
import { getBidHistorySummary } from "@/utils/getBidHistorySummary";
import { getItemAuctionedSummary } from "@/utils/getItemAuctionedSummary";
import { PiClockLight } from "react-icons/pi";
import { FaClock } from "react-icons/fa";
import { isTheAuctionEnded } from "@/utils/isTheAuctionEnded";

type Params = {
  id: string | undefined;
};

const UserProfilePage = () => {
  const [searchParams] = useSearchParams();
  const { id } = useParams<Params>();
  const userName = searchParams.get("UserName") || "User";

  return (
    <Box maxW="5xl" mx="auto">
      <HStack gap="4" my={8} alignItems="center">
        <Avatar.Root size="2xl" colorPalette={pickAvatarColorPalette(userName)}>
          <Avatar.Fallback name={userName} />
        </Avatar.Root>
        <Stack gap="0">
          <Heading fontWeight="bolder" fontSize="2xl">
            {userName}
          </Heading>
          <Text color="fg.muted" textStyle="sm">
            @{userName}
          </Text>
        </Stack>
      </HStack>
      <Tabs.Root
        lazyMount
        unmountOnExit
        defaultValue="tab-1"
        variant="outline"
        fitted
      >
        <Tabs.List>
          <Tabs.Trigger value="tab-1">Items Auctioned</Tabs.Trigger>
          <Tabs.Trigger value="tab-2">Bid History</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="tab-1">
          <ItemsAuctioned userId={Number(id)} />
        </Tabs.Content>
        <Tabs.Content value="tab-2">
          <BidHistory userId={Number(id)} />
        </Tabs.Content>
      </Tabs.Root>
    </Box>
  );
};

type Props = {
  userId: number;
};

const ItemsAuctioned = ({ userId }: Props) => {
  const { data, isLoading } = useSellAuctions(userId);

  return (
    <Box>
      <HStack my={5}>
        <Heading fontWeight="bold">Items Auctioned</Heading>
        {Array.isArray(data) && (
          <Text color="fg.muted">({getItemAuctionedSummary(data)})</Text>
        )}
      </HStack>
      <Box>
        {isLoading ? (
          <SkeletonText noOfLines={4} gap="4" />
        ) : (
          Array.isArray(data) &&
          (data.length > 0 ? (
            <SimpleGrid columns={4} gap="40px">
              {data.map((auction) => (
                <Link to={`/auctions/${auction.id}`} key={auction.id}>
                  <ItemCard auction={auction} key={auction.id} />
                </Link>
              ))}
            </SimpleGrid>
          ) : (
            <EmptyState.Root>
              <EmptyState.Content>
                <EmptyState.Indicator>
                  <HiColorSwatch />
                </EmptyState.Indicator>
                <VStack textAlign="center">
                  <EmptyState.Title>No results found</EmptyState.Title>
                </VStack>
              </EmptyState.Content>
            </EmptyState.Root>
          ))
        )}
      </Box>
    </Box>
  );
};

const BidHistory = ({ userId }: Props) => {
  const { data, isLoading } = useBuyAuctions(userId);

  return (
    <Box>
      <HStack my={5}>
        <Heading fontWeight="bold">Bid History</Heading>
        {Array.isArray(data) && (
          <Text color="fg.muted">({getBidHistorySummary(data, userId)})</Text>
        )}
      </HStack>
      <Box>
        {isLoading ? (
          <SkeletonText noOfLines={4} gap="4" />
        ) : (
          Array.isArray(data) &&
          (data.length > 0 ? (
            <SimpleGrid columns={4} gap="40px">
              {data.map((bid) => (
                <Link to={`/auctions/${bid.item.id}`} key={bid.item.id}>
                  <ItemCard
                    auction={bid.item}
                    key={bid.id}
                    badge={
                      bid.item.buyerId === userId ? (
                        <Box position="absolute" bottom="10px" left="10px">
                          <Badge size="md" variant="solid" colorPalette="green">
                            Won for{" "}
                            <FormatNumber
                              value={bid.item.buyerPayAmount!}
                              style="currency"
                              currency="USD"
                              maximumFractionDigits={0}
                            />
                          </Badge>
                        </Box>
                      ) : (
                        <Box position="absolute" bottom="10px" left="10px">
                          <HStack>
                            {!isTheAuctionEnded(bid.item.endDate) && (
                              <Badge
                                size="md"
                                variant="solid"
                                colorPalette="gray"
                              >
                                <FaClock />
                              </Badge>
                            )}
                            <Badge
                              size="md"
                              variant="solid"
                              colorPalette="gray"
                            >
                              Bid{" "}
                              <FormatNumber
                                value={bid.amount}
                                style="currency"
                                currency="USD"
                                maximumFractionDigits={0}
                              />
                            </Badge>
                          </HStack>
                        </Box>
                      )
                    }
                  />
                </Link>
              ))}
            </SimpleGrid>
          ) : (
            <EmptyState.Root>
              <EmptyState.Content>
                <EmptyState.Indicator>
                  <HiColorSwatch />
                </EmptyState.Indicator>
                <VStack textAlign="center">
                  <EmptyState.Title>No results found</EmptyState.Title>
                </VStack>
              </EmptyState.Content>
            </EmptyState.Root>
          ))
        )}
      </Box>
    </Box>
  );
};

export default UserProfilePage;
