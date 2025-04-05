import { CommentLoading } from "@/components/Comment";
import {
  CommentDto,
  usePaginatedComments,
} from "@/hooks/queries/usePaginatedComments";
import {
  Stack,
  Center,
  VStack,
  Button,
  Text,
  Flex,
  EmptyState,
} from "@chakra-ui/react";
import { Comment } from "@/components/Comment";
import React, { memo, useEffect, useState } from "react";
import { useRealTime } from "@/context/RealTimeContext";
import { FaRegComments } from "react-icons/fa";

type Props = {
  itemId: string | undefined;
};

export const Comments = memo(({ itemId }: Props) => {
  const [allComments, setAllComments] = useState<CommentDto[]>([]);

  const {
    data,
    isLoading,
    isError,
    refetch,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isFetching,
  } = usePaginatedComments(itemId);

  useEffect(() => {
    if (data) {
      setAllComments(data.pages.flatMap((p) => p.content));
    }
  }, [data]);

  const { connection } = useRealTime();

  useEffect(() => {
    if (connection !== null) {
      connection.on("CommentCreated", (message: string) => {
        const comment: CommentDto = JSON.parse(message);
        setAllComments((previous) => [comment, ...previous]);
      });

      connection.on("CommentUpdated", (message: string) => {
        const comment: CommentDto = JSON.parse(message);
        setAllComments((previous) => {
          const copiedPrevious = [...previous];

          const index = copiedPrevious.findIndex((c) => c.id === comment.id);
          if (index >= 0) {
            copiedPrevious[index] = comment;
          }

          return copiedPrevious;
        });
      });
    }

    return () => {
      if (connection !== null) {
        connection.off("CommentCreated");
        connection.off("CommentUpdated");
      }
    };
  }, [connection, allComments]);

  if (isLoading) {
    return (
      <Stack gap="8" mt={8}>
        {[1, 2, 3, 4].map((n, i) => (
          <CommentLoading key={i} />
        ))}
      </Stack>
    );
  }

  if (isError) {
    return (
      <Center mt={8} mb={5}>
        <VStack>
          <Text color="fg.muted" textStyle="sm">
            Comments unavailable. Please try again later.
          </Text>
          <Button mx="auto" variant="ghost" onClick={() => refetch()}>
            Retry
          </Button>
        </VStack>
      </Center>
    );
  }

  if (allComments.length === 0) {
    return (
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
    );
  }

  return (
    <>
      <Stack gap="8" mt={8}>
        {allComments.map((c) => (
          <Comment key={c.id} comment={c} />
        ))}
      </Stack>
      <Flex justifyContent="center" my="8">
        <Button
          variant="plain"
          onClick={() => fetchNextPage()}
          loading={isFetchingNextPage}
          loadingText="Loading more..."
          disabled={!hasNextPage || isFetchingNextPage}
        >
          {isFetchingNextPage ? (
            "Loading more..."
          ) : hasNextPage ? (
            "Load More"
          ) : (
            <Text
              textAlign="center"
              fontStyle="italic"
              fontSize="md"
              color="fg.muted"
            >
              -- No more comments --
            </Text>
          )}
        </Button>
      </Flex>
      <div>{isFetching && !isFetchingNextPage ? "Fetching..." : null}</div>
    </>
  );
});
