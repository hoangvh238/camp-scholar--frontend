import {
  Button,
  Flex,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import { BsCoin } from "react-icons/bs";
import { LiaDonateSolid } from "react-icons/lia";
import { donatePost } from "../../../../apis/posts";

import { UserCoint, updateCoint } from "@/redux/slices/userInfor";
import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";

type DonateItems = {
  postId: number;
  type: "post" | "page";
};
const Donate: React.FC<DonateItems> = ({ postId, type }) => {
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
  const IconHoverBg = useColorModeValue("gray.200", "#2A4365");
  const IconBg = useColorModeValue("none", "#A0AEC0");
  const [value, setValue] = React.useState(0);

  const handleChange = (newValue: number) => {
    setValue(newValue);
  };

  const currentCoin = useSelector((state: RootState) => state.userInfor.userCoint.coint);

  const getBackgroundColor = (value: number) => {
    const hue = (value / 100) * 100;
    return `hsl(${hue}, 100%, 50%)`;
  };

  const handleDonate = async () => {
    try {
      await donatePost(postId, value);
      onClose();

      const updatedCoin: UserCoint = {
        coint: currentCoin - value,
      };

      dispatch(updateCoint({ coint: updatedCoin }));
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Donate</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Flex>
              <NumberInput maxW="100px" mr="2rem" value={value} onChange={handleChange}>
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <Slider flex="1" focusThumbOnChange={false} value={value} onChange={handleChange}>
                <SliderTrack>
                  <SliderFilledTrack background={getBackgroundColor(value)} />
                </SliderTrack>
                <SliderThumb fontSize="sm" boxSize="32px" children={value} />
              </Slider>
            </Flex>
            <div className="flex justify-center mt-5 content-center gap-2">
              <Text fontWeight="bold">Bạn sẽ ủng hộ: {value}</Text>
              <div className="flex flex-col justify-center">
                <BsCoin />
              </div>
            </div>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleDonate}>
              Gửi
            </Button>
            <Button onClick={onClose}>Hủy</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Flex onClick={onOpen} align="center" p="8px 10px" borderRadius={4} _hover={{ bg: IconHoverBg }} cursor="pointer">
        <Icon as={LiaDonateSolid} mr={2} color={IconBg} />
        {type === "post" ? (
          <Text fontSize="9pt" color={IconBg} onClick={onOpen}>
            Donate
          </Text>
        ) : (
          ""
        )}
      </Flex>
    </>
  );
};

export default Donate;
