import { useParams } from "react-router-dom";
import { useAuctionDetail } from "../../hooks/queries/useAuctionDetail";
import {
  Box,
  Button,
  Input,
  Text,
  Image,
  Badge,
  HStack,
  Flex,
  Heading,
  Grid,
  GridItem,
  Stack,
  Status,
  Center,
  Card,
  DialogCloseTrigger,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
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
import { FaArrowUp, FaHashtag, FaRegClock, FaRegComment } from "react-icons/fa";
import { Comment, CommentLoading } from "@/components/Comment";
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
import { Bid, BidLoading } from "@/components/Bid";
import { TimeLeft } from "@/components/TimeLeft";

dayjs.extend(relativeTime);

type Params = {
  id: string;
};

const AuctionDetailPage = () => {
  const [comment, setComment] = useState("");
  const [bidPlaceDialogOpen, setBidPlaceDialogOpen] = useState(false);
  const bidAmountInputRef = useRef<HTMLInputElement>(null);

  const { id } = useParams<Params>();

  const { data, isLoading, isError, error } = useAuctionDetail(id);

  const {
    data: comments,
    isFetching: commentsIsFetching,
    isError: commentsIsError,
    error: commentsError,
    refetch: commentsRefetch,
  } = usePaginatedComments(id);

  useEffect(() => {
    if (commentsIsError) {
      console.log(commentsError);
    }
  }, [commentsIsError]);

  const {
    data: bids,
    isError: bidsIsError,
    error: bidsError,
    isLoading: bidsIsLoading,
  } = useBids(data?.id);

  const commentCreateMutation = useCreateComment();

  const bidCreateOrUpdateMutation = useCreateOrUpdateBid();

  const handleAddComment = () => {
    if (Boolean(comment.trim())) {
      commentCreateMutation.mutate({
        itemId: Number(id),
        commentText: comment.trim(),
      });

      setComment("");
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
              <Text>{data.description}</Text>
            </Box>
            <Grid mt={3} templateColumns="repeat(4, 1fr)" gap="6">
              <GridItem colSpan={3}>
                {data.images.length > 0 && (
                  <Card.Root height="500px">
                    <Image
                      rounded="sm"
                      overflow="hidden"
                      key={data.images[0].name}
                      width="100%"
                      height="100%"
                      objectFit="cover"
                      src={AUCTION_IMAGES + data.images[0].name}
                      alt={AUCTION_IMAGES + data.images[0].name}
                    />
                  </Card.Root>
                )}
              </GridItem>
              <GridItem colSpan={1}>
                <Box>
                  <Card.Root size="sm" height="500px">
                    <Card.Header>
                      <Heading size="md">Bids</Heading>
                    </Card.Header>
                    <Card.Body
                      color="fg.info"
                      overflowY="scroll"
                      overflowX="hidden"
                    >
                      {bidsIsLoading ? (
                        <Stack gap="4">
                          {[1, 2, 3, 4, 5].map((_, i) => (
                            <BidLoading key={i} />
                          ))}
                        </Stack>
                      ) : bidsIsError ? (
                        <Center>
                          <Text>Bids unavailable.</Text>
                        </Center>
                      ) : (
                        <Stack gap="4">
                          {Array.isArray(bids) &&
                            bids.map((bid) => <Bid bid={bid} key={bid.id} />)}
                        </Stack>
                      )}
                    </Card.Body>
                  </Card.Root>
                </Box>
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

            <Grid mt={4} templateColumns="repeat(4, 1fr)" gap="6">
              <GridItem colSpan={3}>
                <HStack justifyContent="space-between" gap="20px">
                  <Flex
                    justifyContent="space-between"
                    rounded="sm"
                    backgroundColor="gray.800"
                    height="45px"
                    width="70%"
                    px="20px"
                    color="fg.muted"
                  >
                    <HStack gap="10px">
                      <FaRegClock />
                      <Text>Time Left</Text>
                      <Text textStyle="xl" color="white" fontWeight="bold">
                        <TimeLeft endDate={data.endDate} />
                      </Text>
                    </HStack>
                    <HStack gap="10px">
                      <FaArrowUp />
                      <Text>High Bid</Text>
                      <Text textStyle="xl" color="white" fontWeight="bold">
                        {data.currentHighestBid || 0}
                      </Text>
                    </HStack>
                    <HStack gap="10px">
                      <FaHashtag />
                      <Text>Bids</Text>
                      <Text textStyle="xl" color="white" fontWeight="bold">
                        {bids?.length || 0}
                      </Text>
                    </HStack>
                    <HStack gap="10px">
                      <FaRegComment />
                      <Text>Comments</Text>
                      <Text textStyle="xl" color="white" fontWeight="bold">
                        {comments?.content.length || 0}
                      </Text>
                    </HStack>
                  </Flex>
                  <DialogRoot
                    initialFocusEl={() => bidAmountInputRef.current}
                    open={bidPlaceDialogOpen}
                    onOpenChange={(e) => setBidPlaceDialogOpen(e.open)}
                  >
                    <DialogTrigger asChild>
                      <Button
                        height="45px"
                        width="120px"
                        loading={bidsIsLoading}
                      >
                        Place Bid
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Bid Amount</DialogTitle>
                      </DialogHeader>
                      <DialogBody pb="4">
                        <NumberInputRoot
                          defaultValue={String(data.startingBid)}
                          min={data.startingBid}
                          step={data.startingBid}
                        >
                          <NumberInputField
                            ref={bidAmountInputRef}
                            placeholder="Amount"
                          />
                        </NumberInputRoot>
                      </DialogBody>
                      <DialogFooter>
                        <DialogActionTrigger asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogActionTrigger>
                        <Button onClick={handleUpdateOrCreateBid}>Bid</Button>
                      </DialogFooter>
                      <DialogCloseTrigger />
                    </DialogContent>
                  </DialogRoot>
                </HStack>
                <Flex mt={3} justifyContent="space-between">
                  <Text color="fg.info">Seller: {data.sellerName}</Text>
                  <Text>
                    Ending {dayjs(data.endDate).format("MMMM D [at] h:mm A")}
                  </Text>
                </Flex>
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
                  <Button
                    variant="outline"
                    width="140px"
                    onClick={handleAddComment}
                    disabled={commentsIsError}
                    loading={commentCreateMutation.isLoading}
                  >
                    Comment <LuArrowDown />
                  </Button>
                </HStack>
                {commentsIsFetching ? (
                  <Stack gap="8" mt={8}>
                    {[1, 2, 3, 4].map((n, i) => (
                      <CommentLoading key={i} />
                    ))}
                  </Stack>
                ) : commentsIsError ? (
                  <Center mt={8} mb={5}>
                    <Status.Root colorPalette="orange">
                      <Status.Indicator />
                      Comments are currently unavailable. Please try again
                      later.
                      <Button variant="ghost" onClick={() => commentsRefetch()}>
                        Retry
                      </Button>
                    </Status.Root>
                  </Center>
                ) : (
                  <Stack gap="8" mt={8}>
                    {Array.isArray(comments?.content) &&
                      comments.content.map((c) => (
                        <Comment key={c.id} comment={c} />
                      ))}
                  </Stack>
                )}
              </GridItem>
              <GridItem colSpan={1}></GridItem>
            </Grid>
          </Box>
        )
      )}
    </Box>
  );
};

export default AuctionDetailPage;
