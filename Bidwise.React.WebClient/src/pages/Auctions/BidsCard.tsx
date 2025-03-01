import { BidLoading, Bid } from "@/components/Bid";
import { useBids } from "@/hooks/queries/useBids";
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

export const BidsCard = ({
  itemId,
  openBidPlaceDialog,
}: {
  itemId: string | undefined;
  openBidPlaceDialog: () => void;
}) => {
  const { data, isLoading, isError, refetch } = useBids(itemId);

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
                <Bid bid={bid} key={bid.id} />
              ))}
            </Stack>
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
                <Button variant="subtle" onClick={openBidPlaceDialog}>
                  Place Bid
                </Button>
              </EmptyState.Content>
            </EmptyState.Root>
          ))
        )}
      </Card.Body>
    </Card.Root>
  );
};
