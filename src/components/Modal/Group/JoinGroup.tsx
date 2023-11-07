import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useColorModeValue,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

import { auth } from "../../../firebase/clientApp";
import useDirectory from "../../../hooks/useDirectory";

type CreateCommunityModelProps = {
  open: boolean;
  handleClose: () => void;
};

const CreateCommunityModel: React.FC<CreateCommunityModelProps> = ({
  open,
  handleClose,
}) => {
  const isAlphaNumeric = (str: string) => /^[a-zA-Z0-9\s]+$/.test(str);
  const [user] = useAuthState(auth);
  const [CommunitiesName, setCommunities] = useState("");
  const [charsRemaining, setCharsRemaining] = useState(21);
  const [communityType, setCommunityType] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toggleMenuOpen } = useDirectory();
  const bg = useColorModeValue("gray.100", "#1A202C");
  const textColor = useColorModeValue("gray.500", "gray.400");
  const [name, setName] = useState("");
  const [depcriptions, setDepcriptions] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length > 21) return;

    setCommunities(event.target.value);
    setCharsRemaining(21 - event.target.value.length);
  };

  const handleCreateCommunity = async () => {
    if (error) setError("");

    if (!isAlphaNumeric(CommunitiesName) || CommunitiesName.length < 3) {
      return setError(
        "Community names must be between 3–21 characters and can only contain letters, numbers, or spaces.",
      );
    }

    if (!isAlphaNumeric(depcriptions)) {
      return setError(
        "Descriptions can only contain letters, numbers, or spaces.",
      );
    }

    setLoading(true);

    try {
      // ...
    } catch (error: any) {
      console.log("HandleCreateCommunity Error", error);
      setError(error.message);
    }

    setLoading(false);
  };

  return (
    <>
      <Modal isOpen={open} onClose={handleClose} size="4xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            display="flex"
            flexDirection="column"
            fontSize={15}
            padding={3}
          >
            Create a Community
          </ModalHeader>

          <Box pl={3} pr={3}>
            <ModalCloseButton />
            <ModalBody
              display="flex"
              flexDirection="column"
              padding="10px 0px"
            ></ModalBody>
          </Box>
          <ModalFooter bg={bg} borderRadius="0px 0px 10px 10px">
            <Button
              variant="outline"
              height="30px"
              mr={3}
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              height="30px"
              onClick={handleCreateCommunity}
              isLoading={loading}
            >
              Join
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default CreateCommunityModel;
