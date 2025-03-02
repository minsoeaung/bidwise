import { ChangeEvent, useEffect, useState } from "react";
import {
  ItemCreateDto,
  useCreateAuctionItem,
} from "../../hooks/mutations/useCreateAuctionItem";
import {
  Box,
  Button,
  Card,
  Container,
  Fieldset,
  FileUploadHiddenInput,
  Flex,
  Input,
  Stack,
  Textarea,
  VStack,
  Image,
  CloseButton,
  HStack,
} from "@chakra-ui/react";
import { ErrorDisplay } from "../../components/ErrorDisplay";
import { ApiError } from "../../types/ApiError";
import { FaPlus } from "react-icons/fa";
import { Field } from "../../components/ui/field";
import { Checkbox } from "../../components/ui/checkbox";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router";
import { FileUploadRoot, FileUploadTrigger } from "@/components/ui/file-upload";
import {
  IoIosAddCircleOutline,
  IoIosRemoveCircleOutline,
} from "react-icons/io";
import { HiUpload } from "react-icons/hi";

const AUCTION_INITIAL_STATE: Omit<ItemCreateDto, "images"> = {
  name: "",
  description: "",
  categoryName: "",
  endDate: "",
  startingBid: 0,
  vickrey: false,
  attributes: [],
  note: "",
};

type ImageSelect = {
  file: File;
  label: string | null;
  preview: string;
};

const CreateAuctionPage = () => {
  const [values, setValues] = useState(AUCTION_INITIAL_STATE);
  const [attributes, setAttributes] = useState([{ label: "", value: "" }]);
  const [selectedImages, setSelectedImages] = useState<ImageSelect[]>([]);

  const mutation = useCreateAuctionItem();

  const { loggedInUser } = useAuth();

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

    if (files !== null) {
      const images: ImageSelect[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        images.push({
          file: file,
          label: "",
          preview: URL.createObjectURL(file),
        });
      }

      setSelectedImages((prev) => [...prev, ...images]);
    }
  };

  const handleImageRemove = (index: number) => {
    const images = [...selectedImages];
    images.splice(index, 1);
    setSelectedImages(images);
  };

  const handleAttributeChange = (
    index: number,
    newLabel: string,
    newValue: string
  ) => {
    const updated = [...attributes];
    updated[index] = { label: newLabel, value: newValue };
    setAttributes(updated);
    console.log(updated);
  };

  const handleAttributeRemove = (index: number) => {
    setAttributes((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAttributeAdd = () => {
    setAttributes((prev) => [...prev, { label: "", value: "" }]);
  };

  useEffect(() => {
    return () => {
      if (Array.isArray(selectedImages.length) && selectedImages.length > 0) {
        for (let i = 0; i < selectedImages.length; i++) {
          URL.revokeObjectURL(selectedImages[i].preview);
        }
      }
    };
  }, []);

  const handleCreateProduct = () => {
    mutation.mutateAsync({
      ...values,
      images: selectedImages,
      attributes: attributes.filter((a) => a.label && a.value),
    });
  };

  if (!loggedInUser) {
    return <Navigate to="/need-authentication" />;
  }

  return (
    <Container maxW="5xl" mt={5}>
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
                <Field label="Note">
                  <Textarea
                    autoresize
                    name="note"
                    // @ts-ignore
                    value={values.note}
                    onChange={handleFormChange("note")}
                  />
                </Field>
                <Field label="Attributes">
                  <VStack alignItems="start" w="full" gap="10px">
                    {attributes.map((attr, index) => (
                      <HStack w="full">
                        <Input
                          placeholder="Label"
                          w="30%"
                          value={attr.label}
                          onChange={(e) =>
                            handleAttributeChange(
                              index,
                              e.target.value,
                              attr.value
                            )
                          }
                        />
                        <Input
                          placeholder="Value"
                          w="30%"
                          value={attr.value}
                          onChange={(e) =>
                            handleAttributeChange(
                              index,
                              attr.label,
                              e.target.value
                            )
                          }
                        />
                        <Button
                          variant="ghost"
                          onClick={() => handleAttributeRemove(index)}
                        >
                          <IoIosRemoveCircleOutline />
                        </Button>
                      </HStack>
                    ))}

                    <Button
                      variant="outline"
                      borderStyle="dashed"
                      w="calc(60% + 8px)"
                      onClick={handleAttributeAdd}
                    >
                      <IoIosAddCircleOutline />
                    </Button>
                  </VStack>
                </Field>
                <Field label="Vickrey">
                  <Checkbox
                    required
                    name="vickrey"
                    checked={values.vickrey}
                    onCheckedChange={(e) => {
                      setValues((prev) => ({
                        ...prev,
                        vickrey: !!e.checked,
                      }));
                    }}
                  />
                </Field>
                <Field label="Images">
                  {selectedImages.length > 0 && (
                    <Flex flexWrap="wrap" gap="10px" my={5}>
                      {selectedImages.map((img, index) => (
                        <VStack>
                          <Box
                            aspectRatio={3 / 2}
                            h="150px"
                            rounded="md"
                            overflow="hidden"
                            key={index}
                            position="relative"
                          >
                            <CloseButton
                              position="absolute"
                              top="0px"
                              right="0px"
                              variant="plain"
                              color="fg.error"
                              onClick={() => handleImageRemove(index)}
                            />
                            <Image
                              src={img.preview}
                              w="full"
                              h="full"
                              objectFit="cover"
                            />
                          </Box>
                          {/* <Input placeholder="Label" size="sm" /> */}
                        </VStack>
                      ))}
                    </Flex>
                  )}
                  <Stack align="flex-start">
                    <FileUploadRoot
                      onChange={handleImagesInputChange}
                      maxFiles={20}
                      maxFileSize={5000}
                      accept="image/*"
                    >
                      <FileUploadHiddenInput />
                      <FileUploadTrigger asChild>
                        <Button variant="outline" size="sm">
                          <HiUpload /> Select images
                        </Button>
                      </FileUploadTrigger>
                    </FileUploadRoot>
                  </Stack>
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
              <FaPlus /> Create Auction
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
        </Card.Body>
      </Card.Root>
    </Container>
  );
};

export default CreateAuctionPage;
