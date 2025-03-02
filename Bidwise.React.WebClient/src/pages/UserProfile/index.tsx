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
} from "@chakra-ui/react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { pickAvatarColorPalette } from "@/utils/pickAvatarColorPalette";
import { SkeletonText } from "@/components/ui/skeleton";
import { ItemCard } from "@/components/ItemCard";
import { HiColorSwatch } from "react-icons/hi";

type Params = {
  id: string | undefined;
};

const UserProfilePage = () => {
  const [searchParams] = useSearchParams();
  const { id } = useParams<Params>();
  const userName = searchParams.get("UserName") || "User";

  return (
    <Box maxW="5xl" mx="auto" mt={8}>
      <HStack gap="4" my={8}>
        <Avatar.Root size="xl" colorPalette={pickAvatarColorPalette(userName)}>
          <Avatar.Fallback name={userName} />
        </Avatar.Root>
        <Stack gap="0">
          <Text fontWeight="medium">{userName}</Text>
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
      <HStack>
        <Heading>Items Auctioned</Heading>
        {Array.isArray(data) && (
          <Text color="fg.muted">
            (Listed {data.length} items, {data.filter((d) => d.buyerId).length}{" "}
            sold)
          </Text>
        )}
      </HStack>
      <Box mt={3}>
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
      <HStack>
        <Heading>Bid History</Heading>
        {Array.isArray(data) && (
          <Text color="fg.muted">
            (Bid on {data.length},{" "}
            {data.filter((d) => d.item.buyerId === userId).length} wins)
          </Text>
        )}
      </HStack>
      <Box mt={3}>
        {isLoading ? (
          <SkeletonText noOfLines={4} gap="4" />
        ) : (
          Array.isArray(data) &&
          (data.length > 0 ? (
            <SimpleGrid columns={4} gap="40px">
              {data.map((bid) => (
                <Box display="inline-block" pos="relative" key={bid.item.id}>
                  <Link to={`/auctions/${bid.item.id}`}>
                    <ItemCard auction={bid.item} key={bid.id} />
                    {bid.item.buyerId === userId ? (
                      <Float placement="top-end">
                        <Badge size="sm" variant="solid" colorPalette="green">
                          Won for{" "}
                          <FormatNumber
                            value={bid.item.buyerPayAmount!}
                            style="currency"
                            currency="USD"
                            maximumFractionDigits={0}
                          />
                        </Badge>
                      </Float>
                    ) : (
                      <Float placement="top-end">
                        <Badge size="sm" variant="surface" colorPalette="teal">
                          Bidded{" "}
                          <FormatNumber
                            value={bid.amount}
                            style="currency"
                            currency="USD"
                            maximumFractionDigits={0}
                          />
                        </Badge>
                      </Float>
                    )}
                  </Link>
                </Box>
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
