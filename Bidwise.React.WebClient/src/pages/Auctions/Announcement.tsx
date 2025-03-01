import { useAuth } from "@/context/AuthContext";
import { AuctionDto } from "@/hooks/queries/useAuctionDetail";
import { useBids } from "@/hooks/queries/useBids";
import { Alert, Button, FormatNumber, Text } from "@chakra-ui/react";
import dayjs from "dayjs";
import { FaRegClock } from "react-icons/fa";
import { RiAuctionLine } from "react-icons/ri";

export const Announcement = ({
  data,
  openBidPlaceDialog,
}: {
  data: AuctionDto;
  openBidPlaceDialog: () => void;
}) => {
  const { userId } = useAuth();

  const { data: allBids } = useBids(String(data.id));

  const myBid = Array.isArray(allBids)
    ? allBids.find((b) => b.bidderId === userId)
    : null;

  const myBidIsTheHighest = userId
    ? data.currentHighestBidderId === userId
    : false;

  const myBidWon = userId ? data?.buyerId === userId : false;

  if (myBidWon) {
    return (
      <Alert.Root title="Success" status="success" mt={6}>
        <Alert.Indicator>
          <RiAuctionLine />
        </Alert.Indicator>
        <Alert.Content color="fg">
          <Alert.Title>Auction Won!</Alert.Title>
          <Alert.Description>
            Your bid of{" "}
            <FormatNumber
              value={data.buyerPayAmount!}
              style="currency"
              currency="USD"
              maximumFractionDigits={0}
            />{" "}
            won this auction.
          </Alert.Description>
        </Alert.Content>
      </Alert.Root>
    );
  }

  if (data.buyerId) {
    return (
      <Alert.Root title="Auction ended" status="info" mt={6}>
        <Alert.Indicator>
          <RiAuctionLine />
        </Alert.Indicator>
        <Alert.Content color="fg">
          <Alert.Title>Auction Ended</Alert.Title>
          <Alert.Description>
            {myBid ? (
              <>
                You placed{" "}
                <Text fontWeight="bold" display="inline">
                  <FormatNumber
                    value={myBid.amount!}
                    style="currency"
                    currency="USD"
                    maximumFractionDigits={0}
                  />
                </Text>
                , but a higher bid of{" "}
                <Text fontWeight="bold" display="inline">
                  <FormatNumber
                    value={data.buyerPayAmount!}
                    style="currency"
                    currency="USD"
                    maximumFractionDigits={0}
                  />
                </Text>{" "}
                from{" "}
                <Text fontWeight="bold" display="inline">
                  {data.buyerName}
                </Text>{" "}
                won the auction. Better luck next time!
              </>
            ) : (
              <>
                Winner:{" "}
                <Text fontWeight="bold" display="inline">
                  {data.buyerName}
                </Text>
                , Bid:{" "}
                <Text fontWeight="bold" display="inline">
                  <FormatNumber
                    value={data.buyerPayAmount!}
                    style="currency"
                    currency="USD"
                    maximumFractionDigits={0}
                  />
                </Text>
              </>
            )}
          </Alert.Description>
        </Alert.Content>
      </Alert.Root>
    );
  }

  if (myBid) {
    return (
      <Alert.Root
        mt={6}
        borderStartWidth="3px"
        borderStartColor="colorPalette.solid"
        status="neutral"
      >
        <Alert.Indicator>
          <FaRegClock />
        </Alert.Indicator>
        <Alert.Content>
          <Alert.Title>
            You placed a bid of{" "}
            <Text fontWeight="bold" display="inline">
              <FormatNumber
                value={myBid.amount!}
                style="currency"
                currency="USD"
                maximumFractionDigits={0}
              />
            </Text>{" "}
            — last updated on{" "}
            {dayjs(myBid.updatedAt).format("MMMM D [at] h:mm A")}.
          </Alert.Title>
          <Alert.Description>
            {myBidIsTheHighest
              ? "You're currently the highest bidder."
              : "Your bid is no longer the highest. Please adjust to regain the lead."}
          </Alert.Description>
        </Alert.Content>
        {!myBidIsTheHighest && (
          <Button variant="ghost" onClick={openBidPlaceDialog}>
            Adjust
          </Button>
        )}
      </Alert.Root>
    );
  }

  return null;
};
