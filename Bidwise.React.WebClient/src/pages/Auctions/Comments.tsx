import { CommentLoading } from "@/components/Comment";
import { usePaginatedComments } from "@/hooks/queries/usePaginatedComments";
import {
  Stack,
  Center,
  VStack,
  Button,
  EmptyState,
  Text,
} from "@chakra-ui/react";
import { FaRegComments } from "react-icons/fa";
import { Comment } from "@/components/Comment";

type Props = {
  itemId: string | undefined;
};

export const Comments = ({ itemId }: Props) => {
  const { data, isLoading, isError, refetch } = usePaginatedComments(itemId);

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

  if (Array.isArray(data?.content)) {
    if (data?.content.length > 0) {
      return (
        <Stack gap="8" mt={8}>
          {data.content.map((c) => (
            <Comment key={c.id} comment={c} />
          ))}
        </Stack>
      );
    } else {
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
  }

  return null;
};
