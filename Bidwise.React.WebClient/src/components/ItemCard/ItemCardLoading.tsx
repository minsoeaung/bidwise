import { Stack, Skeleton, AspectRatio } from "@chakra-ui/react";
import { SkeletonText } from "../ui/skeleton";

export const ItemCardLoading = () => {
  return (
    <Stack gap="6" maxW="xs">
      <AspectRatio bg="bg.muted" ratio={3 / 2}>
        <Skeleton height="full" rounded="md" />
      </AspectRatio>
      <SkeletonText noOfLines={2} />
    </Stack>
  );
};
