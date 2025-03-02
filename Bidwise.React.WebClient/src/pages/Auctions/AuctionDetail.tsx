import { useParams } from "react-router-dom";
import { useAuctionDetail } from "../../hooks/queries/useAuctionDetail";
import {
  Box,
  Button,
  Input,
  Text,
  HStack,
  Flex,
  Heading,
  Image,
  Grid,
  GridItem,
  Stack,
  Center,
  Card,
  DialogCloseTrigger,
  VStack,
  EmptyState,
  DataList,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { usePaginatedComments } from "../../hooks/queries/usePaginatedComments";
import { useCreateComment } from "../../hooks/mutations/useCreateComment";
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
import { FaRegComments } from "react-icons/fa";
import { Comment, CommentLoading } from "@/components/Comment";
import { Avatar } from "@/components/ui/avatar";
import { LuArrowDown } from "react-icons/lu";
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
import { Announcement } from "./Announcement";
import { BidsCard } from "./BidsCard";
import { toaster } from "@/components/ui/toaster";
import { isTheAuctionEnded } from "@/utils/isTheAuctionEnded";
import { WinnerCard } from "./WinnerCard";
import { SellerNote } from "./SellerNote";
import { SealedBadge } from "@/components/SealedBadge";

dayjs.extend(relativeTime);

type Params = {
  id: string;
};

const stats = [
  { label: "New Users", value: "234", diff: -12, helpText: "Till date" },
  { label: "Sales", value: "£12,340", diff: 12, helpText: "Last 30 days" },
  { label: "Revenue", value: "3,450", diff: 4.5, helpText: "Last 30 days" },
];

const AuctionDetailPage = () => {
  const [comment, setComment] = useState("");
  const [bidPlaceDialogOpen, setBidPlaceDialogOpen] = useState(false);
  const bidAmountInputRef = useRef<HTMLInputElement>(null);

  const { id } = useParams<Params>();

  const { data, isLoading, isError, error } = useAuctionDetail(id);

  const { userId } = useAuth();

  const {
    data: comments,
    isLoading: commentsIsLoading,
    isError: commentsIsError,
    refetch: commentsRefetch,
  } = usePaginatedComments(id);

  const { data: bids, isLoading: bidsIsLoading } = useBids(id);

  const myBid = Array.isArray(bids)
    ? bids.find((b) => b.bidderId === userId)
    : null;

  const commentCreateMutation = useCreateComment();

  const bidCreateOrUpdateMutation = useCreateOrUpdateBid();

  const handleAddComment = () => {
    if (!userId) {
      toaster.create({
        type: "info",
        title: "Please login first",
      });

      return;
    }

    if (Boolean(comment.trim())) {
      commentCreateMutation
        .mutateAsync({
          itemId: Number(id),
          commentText: comment.trim(),
        })
        .then(() => {
          setComment("");
        });
    }
  };

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
    <Box
      maxW="8xl"
      mx="auto"
      mt={2}
      px={{ base: "2", md: "8", lg: "12" }}
      paddingBottom="30px"
    >
      {isLoading ? (
        <Box mt={10}>
          <AntdSpin />
        </Box>
      ) : isError ? (
        <ErrorDisplay error={error as ApiError} />
      ) : (
        data && (
          <Box>
            <Box>
              <Heading>{data.name}</Heading>
              <HStack>
                {data.vickrey && <SealedBadge />}
                <Text>{data.description}</Text>
              </HStack>
            </Box>
            <Announcement
              data={data}
              openBidPlaceDialog={() => setBidPlaceDialogOpen(true)}
            />
            <Grid mt={3} templateColumns="repeat(6, 1fr)" gap="6">
              <GridItem colSpan={4}>
                <Card.Root height="500px">
                  <ImageSlider
                    images={data.images.map((i) => AUCTION_IMAGES + i.name)}
                    imgHeight="500px"
                  />
                  {/* <Image
                    rounded="sm"
                    overflow="hidden"
                    width="100%"
                    height="100%"
                    objectFit="cover"
                    src={
                      data.images.length
                        ? AUCTION_IMAGES + data.images[0].name
                        : "https://th.bing.com/th/id/R.b0869d82d142df30dcd9fed1bee3db77?rik=uNDrfM3foy5Bsw&pid=ImgRaw&r=0"
                    }
                    alt="No alt"
                  /> */}
                </Card.Root>
              </GridItem>
              <GridItem colSpan={2}>
                <BidsCard
                  itemId={id}
                  itemEndDate={data.endDate}
                  itemVickrey={data.vickrey}
                  winningBidderId={data.buyerId}
                  openBidPlaceDialog={() => setBidPlaceDialogOpen(true)}
                />
                {/* {data.images.map((img) => (
                  <Image
                    key={img.name}
                    height="300px"
                    src={AUCTION_IMAGES + img.name}
                    alt={AUCTION_IMAGES + img.name}
                  />
                ))} */}
              </GridItem>
            </Grid>

            <Grid templateColumns="repeat(6, 1fr)" gap="6">
              <GridItem colSpan={4}>
                <Box my={2}>
                  <BreadcrumbsInfo
                    category={data.categoryName}
                    name={data.name}
                  />
                </Box>

                <Flex justifyContent="space-between">
                  <StatBar
                    endDate={data.endDate}
                    vickrey={data.vickrey}
                    currentHighestBid={data.currentHighestBid || 0}
                    totalBids={bids?.length || 0}
                    totalComments={comments?.size || 0}
                  />
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
                </Flex>
                <Flex mt={3} justifyContent="end">
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

                <DataList.Root orientation="horizontal" mt={8}>
                  {stats.map((item) => (
                    <DataList.Item key={item.label}>
                      <DataList.ItemLabel>{item.label}</DataList.ItemLabel>
                      <DataList.ItemValue>{item.value}</DataList.ItemValue>
                    </DataList.Item>
                  ))}
                </DataList.Root>

                <Heading mt={5}>Comments</Heading>
                <HStack
                  mt={5}
                  justifyContent="space-between"
                  alignItems="center"
                  gap="15px"
                >
                  <Input
                    name="commentText"
                    placeholder="Add a comment"
                    value={comment}
                    disabled={commentsIsError}
                    onChange={(e) => setComment(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleAddComment();
                      }
                    }}
                  />
                  {!!userId ? (
                    <Button
                      variant="outline"
                      width="140px"
                      onClick={handleAddComment}
                      disabled={commentsIsError}
                      loading={commentCreateMutation.isLoading}
                    >
                      Comment <LuArrowDown />
                    </Button>
                  ) : (
                    <Button variant="outline" width="140px" asChild>
                      <a href={"/bff/login"}>Login to comment</a>
                    </Button>
                  )}
                </HStack>
                {commentsIsLoading ? (
                  <Stack gap="8" mt={8}>
                    {[1, 2, 3, 4].map((n, i) => (
                      <CommentLoading key={i} />
                    ))}
                  </Stack>
                ) : commentsIsError ? (
                  <Center mt={8} mb={5}>
                    <VStack>
                      <Text color="fg.muted" textStyle="sm">
                        Comments unavailable. Please try again later.
                      </Text>
                      <Button
                        mx="auto"
                        variant="ghost"
                        onClick={() => commentsRefetch()}
                      >
                        Retry
                      </Button>
                    </VStack>
                  </Center>
                ) : (
                  Array.isArray(comments?.content) &&
                  (comments.content.length > 0 ? (
                    <Stack gap="8" mt={8}>
                      {Array.isArray(comments?.content) &&
                        comments.content.map((c) => (
                          <Comment key={c.id} comment={c} />
                        ))}
                    </Stack>
                  ) : (
                    <EmptyState.Root>
                      <EmptyState.Content>
                        <EmptyState.Indicator>
                          <FaRegComments />
                        </EmptyState.Indicator>
                        <VStack textAlign="center">
                          <EmptyState.Description>
                            No comments to display yet
                          </EmptyState.Description>
                        </VStack>
                      </EmptyState.Content>
                    </EmptyState.Root>
                  ))
                )}
              </GridItem>
              <GridItem colSpan={2}></GridItem>
            </Grid>
          </Box>
        )
      )}
    </Box>
  );
};

export default AuctionDetailPage;
