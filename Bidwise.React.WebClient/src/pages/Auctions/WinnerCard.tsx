import { AuctionDto } from "@/hooks/queries/useAuctionDetail";
import {
  Card,
  HStack,
  Stack,
  Button,
  Text,
  Flex,
  Box,
  Avatar,
  Stat,
  FormatNumber,
  Grid,
  VStack,
  DataList,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { CiCalendar } from "react-icons/ci";
import dayjs from "dayjs";
import { useBids } from "@/hooks/queries/useBids";
import { usePaginatedComments } from "@/hooks/queries/usePaginatedComments";
import { pickAvatarColorPalette } from "@/utils/pickAvatarColorPalette";
import { UserLink } from "@/components/UserLink";

type Props = {
  auction: AuctionDto;
};

export const WinnerCard = ({ auction }: Props) => {
  const { data: bids } = useBids(String(auction.id));
  const { data: comments } = usePaginatedComments(String(auction.id));

  if (!auction.buyerId || !auction.buyerName || !auction.buyerPayAmount)
    return null;

  return (
    <Card.Root variant="outline">
      <Card.Body>
        <Grid templateColumns="repeat(2, 1fr)" gap="6">
          <Box>
            <VStack alignItems="start" gap={0}>
              <HStack gap={3}>
                <Text>Sold to</Text>
                <UserLink id={auction.buyerId} userName={auction.buyerName}>
                  <HStack gap={2}>
                    <Avatar.Root
                      size="xs"
                      colorPalette={pickAvatarColorPalette(auction.buyerName)}
                    >
                      <Avatar.Fallback name={auction.buyerName} />
                    </Avatar.Root>
                    <Text>{auction.buyerName}</Text>
                  </HStack>
                </UserLink>
              </HStack>
              <Text fontSize="6xl" fontWeight="bold">
                <FormatNumber
                  value={auction.buyerPayAmount}
                  style="currency"
                  currency="USD"
                  maximumFractionDigits={0}
                />
              </Text>
            </VStack>
          </Box>
          <Box>
            <DataList.Root orientation="horizontal">
              <DataList.Item>
                <DataList.ItemLabel>Seller</DataList.ItemLabel>
                <DataList.ItemValue>
                  <UserLink id={auction.sellerId} userName={auction.sellerName}>
                    <HStack gap={2}>
                      <Avatar.Root
                        size="2xs"
                        colorPalette={pickAvatarColorPalette(
                          auction.sellerName
                        )}
                      >
                        <Avatar.Fallback name={auction.sellerName} />
                      </Avatar.Root>
                      <Text>{auction.sellerName}</Text>
                    </HStack>
                  </UserLink>
                </DataList.ItemValue>
              </DataList.Item>
              <DataList.Item>
                <DataList.ItemLabel>Ended</DataList.ItemLabel>
                <DataList.ItemValue>
                  <HStack gap={2}>
                    <Text fontSize="2xl">
                      <CiCalendar />
                    </Text>
                    <Text>
                      {dayjs(auction.endDate).format("MMM D, YYYY h:mm A")}
                    </Text>
                  </HStack>
                </DataList.ItemValue>
              </DataList.Item>
              <DataList.Item>
                <DataList.ItemLabel>Bids</DataList.ItemLabel>
                <DataList.ItemValue>{bids?.length || 0}</DataList.ItemValue>
              </DataList.Item>
              <DataList.Item>
                <DataList.ItemLabel>Comments</DataList.ItemLabel>
                <DataList.ItemValue>{comments?.size || 0}</DataList.ItemValue>
              </DataList.Item>
            </DataList.Root>
          </Box>
        </Grid>
      </Card.Body>
    </Card.Root>
  );
};
