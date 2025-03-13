import {
  Alert,
  Box,
  Center,
  Container,
  Heading,
  List,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useAuth } from "../../context/AuthContext";
import AntdSpin from "@/components/AntdSpin";

const WhatIsBidwisePage = () => {
  return (
    <Box
      maxW="5xl"
      mx="auto"
      mt={8}
      px={{ base: "2", md: "8", lg: "12" }}
      paddingBottom="30px"
    >
      <Heading fontWeight="bold" fontSize="3xl">
        What is Bidwise?
      </Heading>
      <VStack w="full" alignItems="start" gap="10px" mt={8}>
        <Text>
          Bidwise is an online auction platform where users can browse products,
          place bids, and win items through a transparent and competitive
          bidding system.
        </Text>
        <Text>
          Whether you're looking for exclusive deals or rare products, Bidwise
          makes the auction experience simple, fair, and accessible.
        </Text>
        <Text>With Bidwise, you can:</Text>
        <List.Root pl="40px">
          <List.Item>
            {" "}
            Discover a wide range of products from verified sellers.
          </List.Item>
          <List.Item>
            {" "}
            Participate in bidding with automatic bid tracking.
          </List.Item>
          <List.Item>
            {" "}
            Stay updated with the latest bids and auction end times.
          </List.Item>
          <List.Item>
            Securely manage your bids and transactions through our platform.
          </List.Item>
        </List.Root>
        <Text>
          At Bidwise, we aim to connect buyers and sellers while ensuring fair
          competition and reliable auction outcomes. Start exploring and make
          your wise bid today!
        </Text>
      </VStack>
    </Box>
  );
};

export default WhatIsBidwisePage;
