import { BidDto } from "@/hooks/queries/useBids";
import {
  Stack,
  HStack,
  Avatar,
  Text,
  FormatNumber,
  Stat,
  Flex,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { Skeleton, SkeletonCircle } from "@/components/ui/skeleton";

export const BidLoading = () => {
  return (
    <HStack gap="4">
      <SkeletonCircle size="12" />
      <Stack flex="1">
        <Skeleton height="5" width="90%" />
        <Skeleton height="7" width="50%" />
      </Stack>
    </HStack>
  );
};

export const Bid = ({
  bid,
  isHighestBid,
}: {
  bid: BidDto;
  isHighestBid?: boolean;
}) => {
  return (
    <HStack gap="4" alignItems="start">
      <Avatar.Root size="sm" colorPalette={pickPalette(bid.bidderName)}>
        <Avatar.Fallback name={bid.bidderName} />
      </Avatar.Root>
      <Stat.Root>
        <Stat.Label>
          <Flex alignItems="baseline" gapX="4px" flexWrap="wrap">
            <Text>{bid.bidderName}</Text>
            <Text color="fg.subtle" textStyle="xs">
              {bid.createdAt !== bid.updatedAt && "edited"}{" "}
              {dayjs(
                bid.createdAt !== bid.updatedAt ? bid.updatedAt : bid.createdAt
              ).fromNow()}
            </Text>
          </Flex>
        </Stat.Label>
        <Stat.ValueText fontSize="3xl">
          <FormatNumber
            value={bid.amount}
            style="currency"
            currency="USD"
            maximumFractionDigits={0}
          />
        </Stat.ValueText>
      </Stat.Root>
    </HStack>
  );
};

const colorPalette = ["red", "blue", "green", "yellow", "purple", "orange"];

const pickPalette = (name: string) => {
  const index = name.charCodeAt(0) % colorPalette.length;
  return colorPalette[index];
};
