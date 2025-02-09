import { ChangeEvent, useRef, useState } from "react";
import {
  ImageCreateDto,
  ItemCreateDto,
  useCreateAuctionItem,
} from "../../hooks/mutations/useCreateAuctionItem";
import {
  Box,
  Button,
  Card,
  Container,
  Fieldset,
  Flex,
  Input,
  Textarea,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { ErrorDisplay } from "../../components/ErrorDisplay";
import { ApiError } from "../../types/ApiError";
import { FaPlus } from "react-icons/fa";
import { Field } from "../../components/ui/field";

const AUCTION_INITIAL_STATE: Omit<ItemCreateDto, "images"> = {
  name: "",
  description: "",
  categoryName: "",
  endDate: null,
  startingBid: null,
};

const CreateAuctionPage = () => {
  const [values, setValues] = useState(AUCTION_INITIAL_STATE);
  const [images, setImages] = useState<ImageCreateDto[]>([]);
  const mutation = useCreateAuctionItem();
  const { open, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef(null);

  const handleFormChange =
    (name: keyof ItemCreateDto) =>
    (
      e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
      setValues((prevState) => ({
        ...prevState,
        [name]: e.target.value,
      }));
    };

  const handleImagesInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    const images: ImageCreateDto[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      images.push({
        file: file,
        label: `Label ${i + 1}`,
      });
    }

    setImages(images);
  };

  const handleCreateProduct = () => {
    mutation.mutateAsync({ ...values, images });
  };

  return (
    <Container maxW="7xl">
      <Card.Root>
        <Card.Body>
          <VStack spaceX="8px" spaceY="8px">
            <Fieldset.Root>
              <Fieldset.Content>
                <Field label="Name">
                  <Input
                    required
                    type="text"
                    name="name"
                    value={values.name}
                    onChange={handleFormChange("name")}
                  />
                </Field>
                <Field label="Description">
                  <Textarea
                    required
                    placeholder="Product description"
                    name="description"
                    value={values.description}
                    onChange={handleFormChange("description")}
                  />
                </Field>
                <Field label="Category">
                  <Input
                    required
                    type="text"
                    name="categoryName"
                    value={values.categoryName}
                    onChange={handleFormChange("categoryName")}
                  />
                </Field>
                <Field label="Starting Bid">
                  <Input
                    required
                    type="number"
                    name="startingBid"
                    min={1}
                    value={values.startingBid}
                    onChange={handleFormChange("startingBid")}
                  />
                </Field>
                <Field label="End Date">
                  <Input
                    required
                    type="datetime-local"
                    name="endDate"
                    value={values.endDate}
                    onChange={handleFormChange("endDate")}
                  />
                </Field>
                <Field label="Images">
                  <Input
                    required
                    multiple
                    type="file"
                    onChange={handleImagesInputChange}
                  />
                </Field>
              </Fieldset.Content>
            </Fieldset.Root>
          </VStack>
          <br />
          <br />
          <Flex justify="space-between">
            <Button
              variant="solid"
              colorScheme="blue"
              onClick={handleCreateProduct}
              loading={mutation.isLoading}
            >
              <FaPlus /> Add
            </Button>
          </Flex>
          {!!mutation.error && (
            <>
              <br />
              <Box>
                <ErrorDisplay error={mutation.error as ApiError} />
              </Box>
            </>
          )}
          {/* <AlertDialog
            open={open}
            leastDestructiveRef={cancelRef}
            onClose={onClose}
            isCentered
          >
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  Delete product
                </AlertDialogHeader>
                <AlertDialogBody>
                  Are you sure to delete the product?
                </AlertDialogBody>
                <AlertDialogFooter>
                  <Button ref={cancelRef} onClick={onClose}>
                    Cancel
                  </Button>
                  <Button colorScheme="red" ml={3} loading={mutation.isLoading}>
                    Delete
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog> */}
        </Card.Body>
      </Card.Root>
    </Container>
  );
};

export default CreateAuctionPage;
