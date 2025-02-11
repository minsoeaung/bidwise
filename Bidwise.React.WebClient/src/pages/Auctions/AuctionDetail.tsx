import { useParams } from "react-router-dom";
import { useAuctionDetail } from "../../hooks/queries/useAuctionDetail";
import { Field } from "../../components/ui/field";
import { Box, Button, Input, List, Text, Image } from "@chakra-ui/react";
import { useState } from "react";
import { usePaginatedComments } from "../../hooks/queries/usePaginatedComments";
import { useCreateComment } from "../../hooks/mutations/useCreateComment";
import { AUCTION_IMAGES } from "../../constants/fileUrls";

type Params = {
  id: string;
};

const AuctionDetailPage = () => {
  const [comment, setComment] = useState("");

  const { id } = useParams<Params>();

  const { data, isLoading, isError } = useAuctionDetail(id);
  const { data: comments } = usePaginatedComments(id);
  const mutation = useCreateComment();

  const handleSave = () => {
    mutation.mutate({
      itemId: Number(id),
      commentText: comment.trim(),
    });
  };

  return (
    <Box maxW="7xl" mx="auto" px={{ base: "2", md: "8", lg: "12" }}>
      <b>Auction Id: {id}</b>
      <div>
        {data &&
          data.images.map((img) => (
            <Image
              key={img.name}
              height="100px"
              src={AUCTION_IMAGES + img.name}
              alt={AUCTION_IMAGES + img.name}
            />
          ))}
      </div>
      <p>{data && JSON.stringify(data)}</p>
      <b>Comments</b>
      <List.Root>
        {Array.isArray(comments?.content) &&
          comments.content.map((c) => (
            <List.Item key={c.id}>
              <Text>{c.commentText}</Text>
            </List.Item>
          ))}
      </List.Root>
      <Box>
        <Field label="Comment">
          <Input
            name="commentText"
            placeholder="Comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </Field>
      </Box>
      <Button variant="outline" onClick={handleSave} disabled={!comment}>
        Save
      </Button>
    </Box>
  );
};

export default AuctionDetailPage;
