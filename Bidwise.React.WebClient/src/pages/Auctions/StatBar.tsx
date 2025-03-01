import { TimeLeft } from "@/components/TimeLeft";
import { AuctionDto } from "@/hooks/queries/useAuctionDetail";
import { isTheAuctionEnded } from "@/utils/isTheAuctionEnded";
import { Flex, HStack, Text } from "@chakra-ui/react";
import dayjs from "dayjs";
import { FaRegClock, FaArrowUp, FaHashtag, FaRegComment } from "react-icons/fa";

type Props = {
  endDate: string;
  currentHighestBid: number;
  totalBids: number;
  totalComments: number;
};

export const StatBar = ({
  endDate,
  currentHighestBid,
  totalBids,
  totalComments,
}: Props) => {
  const auctionEnded = isTheAuctionEnded(endDate);

  const diffSeconds = dayjs(endDate).diff(dayjs(), "second");
  const secondsIn6Hours = 6 * 3600;

  return (
    <Flex
      justifyContent="space-between"
      rounded="sm"
      backgroundColor={
        diffSeconds > 0
          ? diffSeconds < secondsIn6Hours
            ? "red.800"
            : "gray.800"
          : "black"
      }
      height="45px"
      width={auctionEnded ? "100%" : "70%"}
      px="20px"
      color="fg.subtle"
      _dark={{ color: "fg.muted" }}
    >
      <HStack gap="10px">
        <FaRegClock />
        <Text>Time Left</Text>
        <Text textStyle="xl" color="white" fontWeight="bold">
          <TimeLeft endDate={endDate} />
        </Text>
      </HStack>
      <HStack gap="10px">
        <FaArrowUp />
        <Text>High Bid</Text>
        <Text textStyle="xl" color="white" fontWeight="bold">
          {currentHighestBid}
        </Text>
      </HStack>
      <HStack gap="10px">
        <FaHashtag />
        <Text>Bids</Text>
        <Text textStyle="xl" color="white" fontWeight="bold">
          {totalBids}
        </Text>
      </HStack>
      <HStack gap="10px">
        <FaRegComment />
        <Text>Comments</Text>
        <Text textStyle="xl" color="white" fontWeight="bold">
          {totalComments}
        </Text>
      </HStack>
    </Flex>
  );
};
