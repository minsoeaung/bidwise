import {
  AspectRatio,
  Badge,
  Box,
  Button,
  Card,
  HStack,
  Image,
  SimpleGrid,
  SimpleGridProps,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useMemo, Children, isValidElement } from "react";
import { AuctionDto } from "../../hooks/queries/useAuctionDetail";
import { AUCTION_IMAGES } from "../../constants/fileUrls";
import { PiClockLight, PiClockThin } from "react-icons/pi";

export const ItemCard = ({ auction }: { auction: AuctionDto }) => {
  return (
    <Card.Root
      maxW="sm"
      overflow="hidden"
      backgroundColor="transparent"
      border="none"
    >
      <Box position="relative">
        <AspectRatio ratio={15 / 10}>
          <Image
            borderRadius="md"
            overflow="hidden"
            src={
              auction.images.length
                ? AUCTION_IMAGES + auction.images[0].name
                : "https://media.carsandbids.com/cdn-cgi/image/width=768,quality=70/c7387fa5557775cb743f87fc02d6cb831afb20b2/photos/9nXLv7NX-EM-e9ZBa_8/edit/_X9SP.jpg?t=173912295422"
            }
            alt={auction.name}
          />
        </AspectRatio>
        <Box position="absolute" bottom="10px" left="10px">
          <Badge variant="solid" colorPalette="red" size="md">
            <HStack gap="10px">
              <HStack gap="5px">
                <PiClockLight />
                <Text>{auction.timeLeft}</Text>
              </HStack>
              <HStack gap="5px">
                <Text fontWeight="light">Bid</Text>
                <Text>$2,300</Text>
              </HStack>
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
};

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
