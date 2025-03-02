import { pickAvatarColorPalette } from "@/utils/pickAvatarColorPalette";
import { Card, HStack, Avatar, Text } from "@chakra-ui/react";
import { memo } from "react";
import { Link } from "react-router-dom";

type Props = {
  note: string;
  sellerId: number;
  sellerName: string;
};

export const SellerNote = memo(({ note, sellerId, sellerName }: Props) => {
  return (
    <Card.Root variant="subtle">
      <Card.Header>
        <Card.Title>
          <Text>Seller Note</Text>
          <Link to={`/users/${sellerId}/listings?UserName=${sellerName}`}>
            <HStack gap={2}>
              <Avatar.Root
                size="2xs"
                colorPalette={pickAvatarColorPalette(sellerName)}
              >
                <Avatar.Fallback name={sellerName} />
              </Avatar.Root>
              <Text fontSize="xs" color="fg.subtle">
                {sellerName}
              </Text>
            </HStack>
          </Link>
        </Card.Title>
      </Card.Header>
      <Card.Body gap="2">
        <Card.Description>{note}</Card.Description>
      </Card.Body>
    </Card.Root>
  );
});

// SellerNote
// IList<Attribute>
// Email sending
// Public buy sell page, win 2, lose 0 etc

// item update, fields, images etc
//  no delete if there is bid
//  no update min bid if there is bid
// vickrey mode
