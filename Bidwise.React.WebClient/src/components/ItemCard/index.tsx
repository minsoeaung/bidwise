import {
  AspectRatio,
  Badge,
  Box,
  Card,
  FormatNumber,
  HStack,
  Image,
  SimpleGrid,
  SimpleGridProps,
  Text,
} from "@chakra-ui/react";
import { useMemo, Children, isValidElement, memo } from "react";
import { AuctionDto } from "../../hooks/queries/useAuctionDetail";
import { AUCTION_IMAGES } from "../../constants/fileUrls";
import { PiClockLight } from "react-icons/pi";
import { TimeLeft } from "../TimeLeft";
import { SealedBadge } from "../SealedBadge";

export const ItemCard = memo(({ auction }: { auction: AuctionDto }) => {
  return (
    <Card.Root
      overflow="hidden"
      backgroundColor="transparent"
      border="none"
      maxWidth="350px"
    >
      <Box position="relative">
        <AspectRatio
          ratio={3 / 2}
          borderWidth="1px"
          rounded="md"
          overflow="hidden"
        >
          <Image
            width="full"
            height="full"
            objectFit="cover"
            loading="lazy"
            src={
              auction.images.length
                ? AUCTION_IMAGES + auction.images[0].name
                : "https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Begrippenlijst.svg"
            }
            alt={auction.name}
          />
        </AspectRatio>
        <Box position="absolute" bottom="10px" left="10px">
          {auction.vickrey ? (
            <HStack>
              <Badge
                variant="surface"
                colorPalette={auction.status === "Expired" ? "red" : undefined}
                size="md"
              >
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
              </Badge>
              {auction.vickrey && <SealedBadge />}
            </HStack>
          ) : (
            <Badge
              variant="surface"
              colorPalette={auction.status === "Expired" ? "red" : undefined}
              size="md"
            >
              {auction.buyerId ? (
                <Text>
                  Sold for{" "}
                  <FormatNumber
                    value={auction.buyerPayAmount!}
                    style="currency"
                    currency="USD"
                    maximumFractionDigits={0}
                  />
                </Text>
              ) : auction.status === "Expired" ? (
                "Expired"
              ) : (
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
              )}
            </Badge>
          )}
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
      lg: 4,
      xl: 4,
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
