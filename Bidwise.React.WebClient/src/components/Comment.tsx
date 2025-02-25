import { CommentDto } from "@/hooks/queries/usePaginatedComments";
import { Stack, HStack, Avatar, Text } from "@chakra-ui/react";
import dayjs from "dayjs";
import { Skeleton, SkeletonCircle } from "@/components/ui/skeleton";

export const Comment = ({ comment }: { comment: CommentDto }) => {
  return (
    <HStack gap="4">
      <Avatar.Root>
        <Avatar.Fallback name={comment.userName} />
      </Avatar.Root>
      <Stack gap="0">
        <HStack>
          <Text fontWeight="medium">{comment.userName}</Text>
          <Text color="fg.subtle" textStyle="sm">
            {dayjs(comment.createdAt).fromNow()}
          </Text>
        </HStack>
        <Text color="fg.muted" textStyle="sm">
          {comment.commentText}
        </Text>
      </Stack>
    </HStack>
  );
};

export const CommentLoading = () => {
  return (
    <HStack gap="5">
      <SkeletonCircle size="12" />
      <Stack flex="1">
        <Skeleton height="5" width="30%" />
        <Skeleton height="7" />
      </Stack>
    </HStack>
  );
};
