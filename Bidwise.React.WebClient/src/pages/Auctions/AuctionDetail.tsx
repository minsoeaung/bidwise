import { Link, useParams } from "react-router-dom";
import { useAuctionDetail } from "../../hooks/queries/useAuctionDetail";
import {
  Box,
  Button,
  Text,
  HStack,
  Flex,
  Heading,
  Grid,
  GridItem,
  Card,
  DialogCloseTrigger,
  VStack,
  DataList,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { usePaginatedComments } from "../../hooks/queries/usePaginatedComments";
import { AUCTION_IMAGES } from "../../constants/fileUrls";
import AntdSpin from "@/components/AntdSpin";
import { ErrorDisplay } from "@/components/ErrorDisplay";
import { ApiError } from "@/types/ApiError";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  NumberInputField,
  NumberInputRoot,
} from "@/components/ui/number-input";
import {
  DialogActionTrigger,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCreateOrUpdateBid } from "@/hooks/mutations/useCreateOrUpdateBid";
import { useBids } from "@/hooks/queries/useBids";
import { useAuth } from "@/context/AuthContext";
import { ImageSlider } from "@/components/ImageSlider";
import { StatBar } from "./StatBar";
import { BreadcrumbsInfo } from "./BreadcrumbsInfo";
import { Announcement } from "./AuctionAnnouncement";
import { BidsCard } from "./BidsCard";
import { isTheAuctionEnded } from "@/utils/isTheAuctionEnded";
import { WinnerCard } from "./WinnerCard";
import { SellerNote } from "./SellerNote";
import { SealedBadge } from "@/components/SealedBadge";
import { AuctionsEndingSoon } from "./AuctionsEndingSoon";
import { Comments } from "./Comments";
import { RiArrowRightLine } from "react-icons/ri";
import { UserLink } from "@/components/UserLink";
import { headerHeight } from "@/components/Header";
import { useRealTime } from "@/context/RealTimeContext";
import { CommentCreate } from "./CommentCreate";

dayjs.extend(relativeTime);

type Params = {
  id: string;
};

export interface AuctionEndedModel {
  id: number;
  sellerId: number;
  buyerId: number | null;
  buyerPayAmount: number | null;
}

const AuctionDetailPage = () => {
  const [bidPlaceDialogOpen, setBidPlaceDialogOpen] = useState(false);
  const bidAmountInputRef = useRef<HTMLInputElement>(null);

  const { id } = useParams<Params>();

  const { data, isLoading, isError, error, refetch } = useAuctionDetail(id);

  const { userId } = useAuth();
  const { connection } = useRealTime();

  useEffect(() => {
    if (connection !== null) {
      connection.invoke("JoinAuctionGroup", Number(id));

      connection.on("AuctionEnded", (message: string) => {
        const auctionEnded: AuctionEndedModel = JSON.parse(message);
        console.log("--> AuctionEnded", auctionEnded);
        refetch();
      });
    }

    return () => {
      if (connection !== null) {
        connection.invoke("LeaveAuctionGroup", Number(id));
        connection.off("AuctionEnded");
      }
    };
  }, [connection]);

  const { data: comments, isError: commentsIsError } = usePaginatedComments(id);

  const { data: bids, isLoading: bidsIsLoading } = useBids(id);

  const myBid = Array.isArray(bids)
    ? bids.find((b) => b.bidderId === userId)
    : null;

  const bidCreateOrUpdateMutation = useCreateOrUpdateBid();

  const handleUpdateOrCreateBid = () => {
    if (data) {
      const amount = Number(bidAmountInputRef.current?.value || 0);
      if (amount >= data.startingBid) {
        bidCreateOrUpdateMutation.mutate({
          amount,
          itemId: data.id,
        });
        if (bidAmountInputRef.current) {
          bidAmountInputRef.current.value = "";
          setBidPlaceDialogOpen(false);
        }
      }
    }
  };

  return (
    <Box maxW="7xl" mx="auto">
      {isLoading ? (
        <Box mt={10}>
          <AntdSpin />
        </Box>
      ) : isError ? (
        <ErrorDisplay error={error as ApiError} />
      ) : (
        data && (
          <Box>
            <Flex justifyContent="space-between" alignItems="center">
              <Box>
                <Heading>{data.name}</Heading>
                <HStack>
                  {data.vickrey && <SealedBadge />}
                  <Text>{data.description}</Text>
                </HStack>
              </Box>
              {!!userId && data.sellerId === userId && (
                <Button variant="outline" asChild>
                  <Link to={`/auctions/${data.id}/edit`}>
                    Edit <RiArrowRightLine />
                  </Link>
                </Button>
              )}
            </Flex>
            <Announcement
              data={data}
              openBidPlaceDialog={() => setBidPlaceDialogOpen(true)}
            />
            <Grid mt={6} templateColumns="repeat(6, 1fr)" gap={1}>
              <GridItem colSpan={4}>
                <Card.Root height="500px">
                  <ImageSlider
                    images={data.images.map((i) => AUCTION_IMAGES + i.name)}
                    imgHeight="500px"
                  />
                </Card.Root>
              </GridItem>
              <GridItem colSpan={2}>
                <BidsCard
                  itemId={id}
                  itemEndDate={data.endDate}
                  itemVickrey={data.vickrey}
                  itemSellerId={data.sellerId}
                  winningBidderId={data.buyerId}
                  openBidPlaceDialog={() => setBidPlaceDialogOpen(true)}
                />
              </GridItem>
            </Grid>

            <Grid templateColumns="repeat(6, 1fr)" gap={12}>
              <GridItem colSpan={4}>
                <Box mt="10px">
                  <BreadcrumbsInfo
                    category={data.categoryName}
                    name={data.name}
                  />
                </Box>

                <Flex
                  backgroundColor="white"
                  _dark={{ backgroundColor: "black" }}
                  py="10px"
                  justifyContent="space-between"
                  gap="10px"
                  position="sticky"
                  top={`${headerHeight}px`}
                  zIndex={100}
                >
                  <StatBar
                    endDate={data.endDate}
                    vickrey={data.vickrey}
                    currentHighestBid={data.currentHighestBid || 0}
                    totalBids={bids?.length || 0}
                    totalComments={
                      comments?.pages.flatMap((p) => p.content).length || 0
                    }
                  />
                  {data.sellerId !== userId &&
                    (!!userId ? (
                      <DialogRoot
                        initialFocusEl={() => bidAmountInputRef.current}
                        open={bidPlaceDialogOpen}
                        onOpenChange={(e) => setBidPlaceDialogOpen(e.open)}
                      >
                        {!isTheAuctionEnded(data.endDate) &&
                          (!data.vickrey || !myBid) && (
                            <DialogTrigger asChild>
                              <Button
                                height="45px"
                                width="120px"
                                disabled={bidsIsLoading || !userId}
                                variant="solid"
                              >
                                {data.status === "Available" && myBid
                                  ? "Adjust Bid"
                                  : "Place Bid"}
                              </Button>
                            </DialogTrigger>
                          )}
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>
                              {" "}
                              {data.status === "Available" && myBid
                                ? "Adjust Bid"
                                : "Bid"}
                            </DialogTitle>
                          </DialogHeader>
                          <DialogBody pb="4">
                            <NumberInputRoot
                              w="full"
                              defaultValue={
                                myBid
                                  ? String(myBid.amount)
                                  : String(data.startingBid)
                              }
                              step={data.startingBid}
                            >
                              <NumberInputField
                                ref={bidAmountInputRef}
                                placeholder="Amount"
                              />
                            </NumberInputRoot>
                            <VStack mt={1} alignItems="start">
                              <Text color="fg.muted">
                                Minimum bid is ${data.startingBid}.
                              </Text>
                            </VStack>
                          </DialogBody>
                          <DialogFooter>
                            <DialogActionTrigger asChild>
                              <Button variant="outline">Cancel</Button>
                            </DialogActionTrigger>
                            <Button onClick={handleUpdateOrCreateBid}>
                              {data.status === "Available" && myBid
                                ? "Adjust Bid"
                                : "Bid"}
                            </Button>
                          </DialogFooter>
                          <DialogCloseTrigger />
                        </DialogContent>
                      </DialogRoot>
                    ) : (
                      !isTheAuctionEnded(data.endDate) &&
                      (!data.vickrey || !myBid) && (
                        <Button
                          height="45px"
                          width="120px"
                          variant="solid"
                          asChild
                        >
                          <a href={"/bff/login"}>Login to bid</a>
                        </Button>
                      )
                    ))}
                </Flex>
                <Flex mt={3} justifyContent="space-between">
                  <Text color="fg.muted">
                    Seller:{" "}
                    <UserLink id={data.sellerId} userName={data.sellerName}>
                      {data.sellerName}
                    </UserLink>
                  </Text>
                  <Text color="fg.muted">
                    Ending {dayjs(data.endDate).format("MMMM D [at] h:mm A")}
                  </Text>
                </Flex>

                {data.note && (
                  <Box mt={5}>
                    <SellerNote
                      note={data.note}
                      sellerId={data.sellerId}
                      sellerName={data.sellerName}
                    />
                  </Box>
                )}

                <Box mt={5}>
                  <WinnerCard auction={data} />
                </Box>

                {!!data.attributes.length && (
                  <DataList.Root orientation="horizontal" mt={8}>
                    {data.attributes.map((attr) => (
                      <DataList.Item key={attr.label}>
                        <DataList.ItemLabel>{attr.label}</DataList.ItemLabel>
                        <DataList.ItemValue>{attr.value}</DataList.ItemValue>
                      </DataList.Item>
                    ))}
                  </DataList.Root>
                )}

                <Heading mt={5} fontWeight="bold">
                  Comments
                </Heading>
                <CommentCreate itemId={id} disabled={commentsIsError} />
                <Comments itemId={id} />
              </GridItem>
              <GridItem colSpan={2}>
                <Heading mt="3rem" fontWeight="bold">
                  Auctions ending soon
                </Heading>
                <Box mt="20px">
                  <AuctionsEndingSoon id={Number(id)} />
                </Box>
              </GridItem>
            </Grid>
          </Box>
        )
      )}
    </Box>
  );
};

export default AuctionDetailPage;
