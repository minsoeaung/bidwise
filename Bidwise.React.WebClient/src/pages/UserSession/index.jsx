import { Alert, Box, Center, Container, DataList } from "@chakra-ui/react";
import { useAuth } from "../../context/AuthContext";
import AntdSpin from "@/components/AntdSpin";

const UserSessionPage = () => {
  const { loggedInUser, loading, error } = useAuth();

  if (loading) {
    return (
      <Box mt={10}>
        <AntdSpin />
      </Box>
    );
  }

  if (error) {
    return (
      <Container mt={3}>
        <Alert.Root status="error">
          <Alert.Indicator />
          <Alert.Title>User is not authenticated.</Alert.Title>
        </Alert.Root>
      </Container>
    );
  }

  return (
    <Center mt={3}>
      <DataList.Root orientation="horizontal">
        {Array.isArray(loggedInUser) &&
          loggedInUser.map((claim) => (
            <DataList.Item key={claim.type}>
              <DataList.ItemLabel>{claim.type}</DataList.ItemLabel>
              <DataList.ItemValue>{claim.value}</DataList.ItemValue>
            </DataList.Item>
          ))}
      </DataList.Root>
    </Center>
  );
};

export default UserSessionPage;
