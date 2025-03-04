import AntdSpin from "@/components/AntdSpin";
import { ErrorDisplay } from "@/components/ErrorDisplay";
import { Field } from "@/components/ui/field";
import { useAuth } from "@/context/AuthContext";
import {
  ItemUpdateDto,
  useUpdateAuction,
} from "@/hooks/mutations/useUpdateAuction";
import { useAuctionDetail } from "@/hooks/queries/useAuctionDetail";
import { ApiError } from "@/types/ApiError";
import {
  Box,
  Input,
  Image,
  Textarea,
  VStack,
  HStack,
  Button,
  FileUploadHiddenInput,
  FileUploadRoot,
  FileUploadTrigger,
  Flex,
  Stack,
  Card,
  Container,
} from "@chakra-ui/react";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import {
  IoIosRemoveCircleOutline,
  IoIosAddCircleOutline,
  IoIosMagnet,
} from "react-icons/io";
import { Navigate, useParams } from "react-router";
import { ImageSelect } from "./CreateAuction";
import { HiUpload } from "react-icons/hi";
import { AttributeCreateDto } from "@/hooks/mutations/useCreateAuctionItem";
import { AUCTION_IMAGES } from "@/constants/fileUrls";
import { getFileFromSrc } from "@/utils/getFileFromSrc";
import { Link } from "react-router-dom";
import { RiArrowRightLine } from "react-icons/ri";
import { CgEye } from "react-icons/cg";
import { ItemCard } from "@/components/ItemCard";

type Params = {
  id: string | undefined;
};

const AUCTION_INITIAL_STATE: Omit<ItemUpdateDto, "images" | "attributes"> = {
  name: "",
  description: "",
  categoryName: "",
  note: "",
};

const AuctionUpdate = () => {
  const { id } = useParams<Params>();

  const { data, isLoading, isError, error } = useAuctionDetail(id);

  const mutation = useUpdateAuction(Number(id));

  const { userId } = useAuth();

  const [values, setValues] = useState(AUCTION_INITIAL_STATE);
  const [attributes, setAttributes] = useState<
    Omit<AttributeCreateDto, "id">[]
  >([{ label: "", value: "" }]);
  const [selectedImages, setSelectedImages] = useState<ImageSelect[]>([]);

  useEffect(() => {
    return () => {
      if (Array.isArray(selectedImages.length) && selectedImages.length > 0) {
        for (let i = 0; i < selectedImages.length; i++) {
          URL.revokeObjectURL(selectedImages[i].preview);
        }
      }
    };
  }, []);

  useEffect(() => {
    if (data) {
      setValues({
        name: data.name,
        description: data.description,
        note: data.note,
        categoryName: data.categoryName,
      });

      if (data.attributes.length > 0) {
        setAttributes(
          data.attributes.map((a) => ({ label: a.label, value: a.value }))
        );
      } else {
        setAttributes([{ label: "", value: "" }]);
      }

      if (data.images.length) {
        (async () => {
          const imgs: ImageSelect[] = [];

          for (let i = 0; i < data.images.length; i++) {
            const img = data.images[i];
            const src = AUCTION_IMAGES + img.name;
            const fileObj = await getFileFromSrc(src, img.name);
            imgs.push({
              file: fileObj,
              label: img.label,
              preview: src,
            });
          }

          setSelectedImages(imgs);
        })();
      }
    }
  }, [data]);

  if (isLoading) {
    return (
      <Box mt={10}>
        <AntdSpin />
      </Box>
    );
  }

  if (isError) {
    return <ErrorDisplay error={error as ApiError} />;
  }

  if (data.sellerId !== userId) {
    return <Navigate to="/forbidden" />;
  }

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

  const handleFormChange =
    (name: keyof ItemUpdateDto) =>
    (
      e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
      setValues((prevState) => ({
        ...prevState,
        [name]: e.target.value,
      }));
    };

  const handleCreateProduct = () => {
    mutation.mutateAsync({
      ...values,
      images: selectedImages,
      attributes: attributes.filter((a) => a.label && a.value),
    });
  };

  if (data) {
    return (
      <Container maxW="5xl" my={5}>
        <ItemCard auction={data} />
        <Card.Root>
          <Card.Body>
            <VStack gap="20px">
              <Field label="Name">
                <Input
                  required
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={values.name}
                  onChange={handleFormChange("name")}
                />
              </Field>
              <Field label="Category">
                <Input
                  required
                  type="text"
                  name="categoryName"
                  placeholder="Category"
                  value={values.categoryName || ""}
                  onChange={handleFormChange("categoryName")}
                />
              </Field>
              <Field label="Description">
                <Input
                  required
                  type="text"
                  name="description"
                  value={values.description}
                  placeholder="Description"
                  onChange={handleFormChange("description")}
                />
              </Field>
              <Field label="Note">
                <Textarea
                  required
                  autoresize
                  placeholder="Note"
                  name="note"
                  // @ts-ignore
                  value={values.note || ""}
                  onChange={handleFormChange("note")}
                />
              </Field>
              <Field label="Attributes">
                <VStack alignItems="start" w="full" gap="10px">
                  {attributes.map((attr, index) => (
                    <HStack w="full" key={index}>
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
              <Field label="Images">
                {selectedImages.length > 0 && (
                  <Flex flexWrap="wrap" gap="10px" my={5}>
                    {selectedImages.map((img, index) => (
                      <VStack key={index}>
                        <Box
                          aspectRatio={3 / 2}
                          h="150px"
                          rounded="md"
                          overflow="hidden"
                          key={index}
                          position="relative"
                        >
                          <Button
                            position="absolute"
                            color="fg.error"
                            top="0px"
                            right="0px"
                            variant="ghost"
                            onClick={() => handleImageRemove(index)}
                          >
                            <IoIosRemoveCircleOutline />
                          </Button>
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
            </VStack>
            <HStack mt={8}>
              <Button
                variant="solid"
                colorScheme="blue"
                onClick={handleCreateProduct}
                loading={mutation.isLoading}
              >
                Update
              </Button>
              <Button variant="outline" asChild>
                <Link to={`/auctions/${data.id}`}>
                  View listing <CgEye />
                </Link>
              </Button>
            </HStack>
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
  }

  return null;
};

export default AuctionUpdate;
