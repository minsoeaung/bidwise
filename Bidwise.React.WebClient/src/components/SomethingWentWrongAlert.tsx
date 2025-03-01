import { Alert } from "@chakra-ui/react";

export const SomethingWentWrongAlert = () => {
  return (
    <Alert.Root status="warning" title="Something went wrong">
      <Alert.Indicator />
      <Alert.Title>Something went wrong</Alert.Title>
    </Alert.Root>
  );
};
