import {
  Alert,
  AlertDescription,
  AlertTitle,
  List,
  ListItem,
  VStack,
} from "@chakra-ui/react";
import { ApiError } from "../types/ApiError";

export const ErrorDisplay = ({ error }: { error: ApiError }) => {
  return (
    <Alert.Root
      status={error.status === 500 ? "error" : "warning"}
      alignItems="start"
    >
      <Alert.Indicator />
      <VStack alignItems="start" spaceX={0}>
        <Alert.Title>{error?.title || "Something went wrong"}</Alert.Title>
        <List.Root>
          {error?.detail ? (
            <List.Item>
              <AlertDescription overflowWrap="break-word">
                {error.detail}
              </AlertDescription>
            </List.Item>
          ) : !!error?.errors ? (
            Object.keys(error.errors).map((key) => {
              const errors = error.errors![key];
              return errors.map((error) => (
                <ListItem>
                  <AlertDescription overflowWrap="break-word">
                    {error}
                  </AlertDescription>
                </ListItem>
              ));
            })
          ) : null}
        </List.Root>
      </VStack>
    </Alert.Root>
  );
};
