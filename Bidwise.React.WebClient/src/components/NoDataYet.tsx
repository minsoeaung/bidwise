import { EmptyState, VStack, List } from "@chakra-ui/react";
import { HiColorSwatch } from "react-icons/hi";

export const NoDataYet = ({
  type,
  suggestions,
}: {
  type: string;
  suggestions?: string[];
}) => {
  return (
    <EmptyState.Root>
      <EmptyState.Content>
        <EmptyState.Indicator>
          <HiColorSwatch />
        </EmptyState.Indicator>
        <VStack textAlign="center">
          <EmptyState.Title>No {type} found</EmptyState.Title>
          {suggestions?.length && (
            <EmptyState.Description>
              Try adjusting your search
            </EmptyState.Description>
          )}
        </VStack>
        {suggestions?.length && (
          <List.Root variant="marker">
            {suggestions.map((sug) => (
              <List.Item key={sug}>{sug}</List.Item>
            ))}
          </List.Root>
        )}
      </EmptyState.Content>
    </EmptyState.Root>
  );
};
