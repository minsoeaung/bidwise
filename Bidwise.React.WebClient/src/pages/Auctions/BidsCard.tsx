import { BidLoading, Bid } from "@/components/Bid";
import { useAuth } from "@/context/AuthContext";
import { useBids } from "@/hooks/queries/useBids";
import { isTheAuctionEnded } from "@/utils/isTheAuctionEnded";
import {
  Card,
  Heading,
  Stack,
  VStack,
  Button,
  EmptyState,
  Text,
} from "@chakra-ui/react";
import { HiColorSwatch } from "react-icons/hi";

type Props = {
  itemId: string | undefined;
  itemEndDate: string;
  itemVickrey: boolean;
  winningBidderId: number | null;
  itemSellerId: number;
  openBidPlaceDialog: () => void;
};

export const BidsCard = ({
  itemId,
  itemEndDate,
  itemVickrey,
  itemSellerId,
  openBidPlaceDialog,
  winningBidderId,
}: Props) => {
  const { userId } = useAuth();

  const { data, isLoading, isError, refetch } = useBids(itemId);

  const ended = isTheAuctionEnded(itemEndDate);

  // loading state
  // bids-service unavailable state
  // bids listing state
  // no bids to list state
  //    - still can bid?
  //    - ended?

  return (
    <Card.Root size="sm" height="500px" variant="subtle">
      <Card.Header>
        <Heading size="md">Bids</Heading>
      </Card.Header>
      <Card.Body overflowY="scroll" overflowX="hidden">
        {isLoading ? (
          <Stack gap="4">
            {[1, 2, 3, 4, 5].map((_, i) => (
              <BidLoading key={i} />
            ))}
          </Stack>
        ) : isError ? (
          <VStack>
            <Text color="fg.muted" textStyle="sm">
              Bids unavailable. Please try again later.
            </Text>
            <Button mx="auto" variant="ghost" onClick={() => refetch()}>
              Retry
            </Button>
          </VStack>
        ) : (
          Array.isArray(data) &&
          (data.length > 0 ? (
            <Stack gap="4">
              {data.map((bid) => (
                <Bid
                  bid={bid}
                  key={bid.id}
                  vickrey={itemVickrey}
                  winnerBid={bid.bidderId === winningBidderId}
                />
              ))}
            </Stack>
          ) : ended ? (
            <EmptyState.Root>
              <EmptyState.Content>
                <EmptyState.Indicator>
                  <HiColorSwatch />
                </EmptyState.Indicator>
                <EmptyState.Title>
                  No bids placed. Auction ended.
                </EmptyState.Title>
              </EmptyState.Content>
            </EmptyState.Root>
          ) : (
            <EmptyState.Root>
              <EmptyState.Content>
                <EmptyState.Indicator>
                  <HiColorSwatch />
                </EmptyState.Indicator>
                <VStack textAlign="center">
                  <EmptyState.Title>No bids yet</EmptyState.Title>
                  <EmptyState.Description>
                    Be the first one to bid
                  </EmptyState.Description>
                </VStack>
                {itemSellerId != userId &&
                  (!!userId ? (
                    <Button variant="subtle" onClick={openBidPlaceDialog}>
                      Place Bid
                    </Button>
                  ) : (
                    <Button variant="subtle" asChild>
                      <a href={"/bff/login"}>Login to bid</a>
                    </Button>
                  ))}
              </EmptyState.Content>
            </EmptyState.Root>
          ))
        )}
      </Card.Body>
    </Card.Root>
  );
};
