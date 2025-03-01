import Slider from "react-slick";
import { useState } from "react";
import { Box, Button, IconButton, Image } from "@chakra-ui/react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const settings = {
  dots: true,
  arrows: false,
  fade: true,
  infinite: true,
  autoplay: false,
  speed: 500,
  autoplaySpeed: 5000,
  slidesToShow: 1,
  slidesToScroll: 1,
};

type Props = {
  imgHeight: string;
  images: string[];
};

export const ImageSlider = ({ imgHeight, images = [] }: Props) => {
  const [slider, setSlider] = useState<Slider | null>(null);

  return (
    <Box
      width="full"
      height="full"
      position="relative"
      overflow="hidden"
      rounded="sm"
    >
      {/* CSS files for react-slick */}
      <link
        rel="stylesheet"
        type="text/css"
        href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
      />
      <link
        rel="stylesheet"
        type="text/css"
        href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
      />
      {images.length > 1 && (
        <>
          <Button
            borderRadius="full"
            position="absolute"
            left="10px"
            top="50%"
            transform={"translate(0%, -50%)"}
            variant="ghost"
            color="white"
            _hover={{ color: "black" }}
            zIndex={2}
            onClick={() => slider?.slickPrev()}
          >
            <FaChevronLeft />
          </Button>
          <Button
            borderRadius="full"
            position="absolute"
            right="10px"
            top="50%"
            transform={"translate(0%, -50%)"}
            variant="ghost"
            color="white"
            _hover={{ color: "black" }}
            zIndex={2}
            onClick={() => slider?.slickNext()}
          >
            <FaChevronRight />
          </Button>
        </>
      )}
      {/* Slider */}
      <Slider {...settings} ref={(slider) => setSlider(slider)}>
        {images.length > 0 ? (
          images.map((url, index) => (
            <Image
              src={url}
              height={imgHeight}
              key={index}
              objectFit="cover"
              objectPosition="center"
              width="full"
            />
          ))
        ) : (
          <Image
            src="https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Begrippenlijst.svg"
            height={imgHeight}
            objectFit="cover"
            objectPosition="center"
            width="full"
          />
        )}
      </Slider>
    </Box>
  );
};
