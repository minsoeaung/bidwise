import {
  AspectRatio,
  Badge,
  Box,
  Button,
  Card,
  FormatNumber,
  HStack,
  Image,
  SimpleGrid,
  SimpleGridProps,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useMemo, Children, isValidElement, memo } from "react";
import { AuctionDto } from "../../hooks/queries/useAuctionDetail";
import { AUCTION_IMAGES } from "../../constants/fileUrls";
import { PiClockLight, PiClockThin } from "react-icons/pi";
import { TimeLeft } from "../TimeLeft";

export const ItemCard = memo(({ auction }: { auction: AuctionDto }) => {
  return (
    <Card.Root
      maxW="sm"
      overflow="hidden"
      backgroundColor="transparent"
      border="none"
    >
      <Box position="relative">
        <AspectRatio bg="bg.muted" ratio={3 / 2}>
          <Image
            borderRadius="md"
            width="full"
            height="full"
            objectFit="cover"
            src={
              auction.images.length
                ? AUCTION_IMAGES + auction.images[0].name
                : "https://api.algobook.info/v1/randomimage?category=places"
            }
            alt={auction.name}
          />
        </AspectRatio>
        <Box position="absolute" bottom="10px" left="10px">
          <Badge variant="subtle" size="md">
            <HStack gap="10px">
              <HStack gap="5px">
                <PiClockLight />
                <Text>
                  {auction.status === "Expired" ? (
                    auction.status
                  ) : (
                    <TimeLeft endDate={auction.endDate} />
                  )}
                </Text>
              </HStack>
              {auction.currentHighestBid && (
                <HStack gap="5px">
                  <Text fontWeight="light">Bid</Text>
                  <FormatNumber
                    value={auction.currentHighestBid}
                    style="currency"
                    currency="USD"
                    maximumFractionDigits={0}
                  />
                </HStack>
              )}
            </HStack>
          </Badge>
        </Box>
      </Box>
      <Card.Body gap="2" backgroundColor="transparent" padding={0}>
        <Card.Title mt={2}>{auction.name}</Card.Title>
        <Card.Description>{auction.description}</Card.Description>
      </Card.Body>
    </Card.Root>
  );
});

export const ItemGrid = (props: SimpleGridProps) => {
  const columns = useMemo(() => {
    const count = Children.toArray(props.children).filter(
      isValidElement
    ).length;
    return {
      base: Math.min(2, count),
      md: Math.min(3, count),
      lg: Math.min(4, count),
      xl: Math.min(4, count),
    };
  }, [props.children]);

  return (
    <SimpleGrid
      columns={columns}
      columnGap={{ base: "4", md: "6" }}
      rowGap={{ base: "8", md: "10" }}
      {...props}
    />
  );
};
