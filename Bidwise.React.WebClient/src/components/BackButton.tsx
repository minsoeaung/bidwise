import { Button } from "@chakra-ui/react";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router";

export const BackButton = () => {
  const navigate = useNavigate();

  return (
    <Button variant="ghost" onClick={() => navigate(-1)}>
      <IoArrowBack /> Back
    </Button>
  );
};
