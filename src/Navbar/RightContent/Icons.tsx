import PaymentModal from "@/components/Modal/Payment/PaymentModal";
import { Flex, Icon, keyframes, useColorModeValue } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useState } from "react";

import { IoWalletOutline } from "react-icons/io5";
import { MdOutlineNotificationsNone } from "react-icons/md";
import { TbBrandAppgallery } from "react-icons/tb";
const animationKeyframes = keyframes`
  0% { transform: scale(1) rotate(0); border-radius: 20%; }
  25% { transform: scale(2) rotate(0); border-radius: 20%; }
  50% { transform: scale(2) rotate(270deg); border-radius: 50%; }
  75% { transform: scale(1) rotate(270deg); border-radius: 50%; }
  100% { transform: scale(1) rotate(0); border-radius: 20%; }
`;

const animation = `${animationKeyframes} 2s ease-in-out infinite`;

const Icons: React.FC = () => {
  const router = useRouter();
  const hoverBg = useColorModeValue("gray.200", "#2A4365");
  const [openPayment, setOpenPayment] = useState(false);

  const handleOpenGallery = () => {
    router.push("/group/document");
  };
  return (
    <Flex>
      <PaymentModal
        open={openPayment}
        handleClose={() => {
          setOpenPayment(false);
        }}
      ></PaymentModal>
      <Flex
        display={{ base: "none", md: "flex" }}
        align="center"
        borderRadius="1px solid"
        borderColor="gray.200"
      >
        <Flex
          mr={1.5}
          ml={1.5}
          padding={1}
          cursor="pointer"
          borderRadius={4}
          _hover={{ bg: hoverBg }}
        ></Flex>
      </Flex>
      <>
        <Flex
          display={{ base: "none", md: "flex" }}
          mr={1.5}
          ml={1.5}
          padding={1}
          cursor="pointer"
          borderRadius={4}
          _hover={{ bg: hoverBg }}
        >
          <Icon
            as={IoWalletOutline}
            fontSize={20}
            onClick={() => {
              setOpenPayment(true);
            }}
          />
        </Flex>
        <Flex
          mr={1.5}
          ml={1.5}
          padding={1}
          cursor="pointer"
          borderRadius={4}
          _hover={{ bg: hoverBg }}
        >
          <Icon as={MdOutlineNotificationsNone} fontSize={22} />
        </Flex>
        <Flex
          mr={1.5}
          ml={1.5}
          padding={1}
          cursor="pointer"
          borderRadius={4}
          _hover={{ bg: hoverBg }}
        >
          <Icon
            as={TbBrandAppgallery}
            fontSize={22}
            onClick={handleOpenGallery}
          />
        </Flex>
      </>
    </Flex>
  );
};
export default Icons;
