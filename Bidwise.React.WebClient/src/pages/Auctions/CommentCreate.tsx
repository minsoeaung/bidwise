import { useAuth } from "@/context/AuthContext";
import { Button, HStack, Input } from "@chakra-ui/react";
import { useState } from "react";
import { LuArrowDown } from "react-icons/lu";
import { toaster } from "@/components/ui/toaster";
import { useCreateComment } from "@/hooks/mutations/useCreateComment";

type Props = {
  itemId: string | undefined;
  disabled: boolean;
};

export const CommentCreate = ({ itemId, disabled = false }: Props) => {
  const [comment, setComment] = useState("");

  const { userId } = useAuth();

  const commentCreateMutation = useCreateComment();

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
          itemId: Number(itemId),
          commentText: comment.trim(),
        })
        .then(() => {
          setComment("");
        });
    }
  };

  return (
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
        onChange={(e) => setComment(e.target.value)}
        disabled={disabled}
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
          disabled={disabled}
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
  );
};
