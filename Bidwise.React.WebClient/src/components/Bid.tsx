import { BidDto } from "@/hooks/queries/useBids";
import { CommentDto } from "@/hooks/queries/usePaginatedComments";
import {
  Stack,
  HStack,
  Avatar,
  Text,
  defineStyle,
  Badge,
  FormatNumber,
  Stat,
  Flex,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { Skeleton, SkeletonCircle } from "@/components/ui/skeleton";

const ringCss = defineStyle({
  outlineWidth: "2px",
  outlineColor: "colorPalette.500",
  outlineOffset: "2px",
  outlineStyle: "solid",
});

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
      <Avatar.Root size="sm">
        <Avatar.Fallback name={bid.bidderName} />
      </Avatar.Root>
      <Stat.Root>
        <Stat.Label>
          <Flex alignItems="baseline" gapX="4px" flexWrap="wrap">
            <Text>{bid.bidderName}</Text>
            <Text color="fg.subtle" textStyle="xs">
              {dayjs(bid.createdAt).fromNow()}
            </Text>
          </Flex>
        </Stat.Label>
        <Stat.ValueText>
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
