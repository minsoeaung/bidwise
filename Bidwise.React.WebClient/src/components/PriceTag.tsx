import { HStack, StackProps, Text, TextProps } from "@chakra-ui/react";
import { ReactNode } from "react";
import { useColorModeValue } from "./ui/color-mode";

interface PriceTagProps {
  currency: string;
  price: number;
  salePrice?: number;
  rootProps?: StackProps;
  priceProps?: TextProps;
  salePriceProps?: TextProps;
}

export const PriceTag = (props: PriceTagProps) => {
  const { price, currency, salePrice, rootProps, priceProps, salePriceProps } =
    props;
  return (
    <HStack spaceX="1" spaceY="1" {...rootProps}>
      <Price isOnSale={!!salePrice} textProps={priceProps}>
        Price
      </Price>
      {salePrice && <SalePrice {...salePriceProps}>Price</SalePrice>}
    </HStack>
  );
};

interface PriceProps {
  children?: ReactNode;
  isOnSale?: boolean;
  textProps?: TextProps;
}

const Price = (props: PriceProps) => {
  const { isOnSale, children, textProps } = props;
  const defaultColor = useColorModeValue("gray.700", "gray.400");
  const onSaleColor = useColorModeValue("gray.400", "gray.700");
  const color = isOnSale ? onSaleColor : defaultColor;
  return (
    <Text
      as="span"
      fontWeight="medium"
      color={color}
      textDecoration={isOnSale ? "line-through" : "none"}
      {...textProps}
    >
      {children}
    </Text>
  );
};

const SalePrice = (props: TextProps) => (
  <Text
    as="span"
    fontWeight="semibold"
    color={useColorModeValue("gray.800", "gray.100")}
    {...props}
  />
);
