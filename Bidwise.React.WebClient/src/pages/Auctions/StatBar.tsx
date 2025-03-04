import { ApiClient } from "@/api/apiClient";
import { TimeLeft } from "@/components/TimeLeft";
import { AuctionDto } from "@/hooks/queries/useAuctionDetail";
import { isTheAuctionEnded } from "@/utils/isTheAuctionEnded";
import { Flex, HStack, Text } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useEffect } from "react";
import { FaRegClock, FaArrowUp, FaHashtag, FaRegComment } from "react-icons/fa";

type Props = {
  endDate: string;
  vickrey: boolean;
  currentHighestBid: number;
  totalBids: number;
  totalComments: number;
};

export const StatBar = ({
  endDate,
  currentHighestBid,
  totalBids,
  vickrey,
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
        !auctionEnded
          ? diffSeconds < secondsIn6Hours
            ? "red"
            : "gray.800"
          : "gray.600"
      }
      height={auctionEnded ? "60px" : "45px"}
      width={auctionEnded ? "100%" : "80%"}
      px="20px"
      color="white"
      _dark={{
        backgroundColor: auctionEnded
          ? "gray.800"
          : diffSeconds < secondsIn6Hours
          ? "red.700"
          : "gray.800",
      }}
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
        {auctionEnded || !vickrey ? (
          <Text textStyle="xl" color="white" fontWeight="bold">
            {currentHighestBid}
          </Text>
        ) : (
          <Text
            textStyle="xl"
            fontStyle="italic"
            color="white"
            fontWeight="bold"
          >
            ****
          </Text>
        )}
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
