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
import { pickAvatarColorPalette } from "@/utils/pickAvatarColorPalette";
import { memo } from "react";

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

type Props = {
  bid: BidDto;
  winnerBid: boolean;
  vickrey: boolean;
};

export const Bid = memo(({ bid, winnerBid, vickrey }: Props) => {
  return (
    <HStack gap="4" alignItems="start">
      <Avatar.Root
        size="sm"
        colorPalette={pickAvatarColorPalette(bid.bidderName)}
      >
        <Avatar.Fallback name={bid.bidderName} />
      </Avatar.Root>
      {vickrey ? (
        <Stat.Root>
          <Stat.Label>
            <Flex alignItems="baseline" gapX="4px" flexWrap="wrap">
              <Text>{bid.bidderName}</Text>
              <Text color="fg.subtle" textStyle="xs">
                {dayjs(bid.createdAt).fromNow()}
              </Text>
            </Flex>
          </Stat.Label>
          <Stat.HelpText mb="2" fontStyle="italic">
            Bid placed.
          </Stat.HelpText>
        </Stat.Root>
      ) : (
        <Stat.Root>
          <Stat.Label>
            <Flex alignItems="baseline" gapX="4px" flexWrap="wrap">
              <Text>{bid.bidderName}</Text>
              <Text color="fg.subtle" textStyle="xs">
                {bid.createdAt !== bid.updatedAt && "edited"}{" "}
                {dayjs(
                  bid.createdAt !== bid.updatedAt
                    ? bid.updatedAt
                    : bid.createdAt
                ).fromNow()}
              </Text>
            </Flex>
          </Stat.Label>
          <Stat.ValueText fontSize="3xl" color={winnerBid ? "fg.success" : ""}>
            <FormatNumber
              value={bid.amount}
              style="currency"
              currency="USD"
              maximumFractionDigits={0}
            />
          </Stat.ValueText>
        </Stat.Root>
      )}
    </HStack>
  );
});
