import { Flex, Icon, Input, useColorModeValue } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { BsLink45Deg } from "react-icons/bs";
import { IoImageOutline } from "react-icons/io5";
import { TbUserSquareRounded } from "react-icons/tb";
import { useSetRecoilState } from "recoil";

import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { authModelState } from "../../atoms/authModalAtom";

type CreatePost = {
  groupID: number;
};
const CreatePostLink: React.FC<CreatePost> = ({ groupID }) => {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.userInfor.currentUser);
  const setAuthModelState = useSetRecoilState(authModelState);
  const bg = useColorModeValue("white", "#1A202C");
  const borderColor = useColorModeValue("gray.300", "#2D3748");
  const searchBg = useColorModeValue("gray.50", "#2D3748");
  const searchBorder = useColorModeValue("gray.200", "#4A5568");

  const onClick = () => {
    if (!user.userName) {
      setAuthModelState({ open: true, view: "login" });
      return;
    }

    // toggleMenuOpen();
    router.push(`/group/submit`);
    return;
  };

  return (
    <Flex
      justify="space-evenly"
      align="center"
      bg={bg}
      height="56px"
      borderRadius={4}
      border="1px solid"
      borderColor={borderColor}
      p={2}
      mb={4}
      onClick={onClick}
    >
      <Icon as={TbUserSquareRounded} fontSize={36} color="gray.300" mr={4} />
      <Input
        placeholder="Bạn đang nghĩ gì ?"
        fontSize="10pt"
        _placeholder={{ color: "gray.500" }}
        _hover={{
          bg: bg,
          border: "1px solid",
          borderColor: "blue.500",
        }}
        _focus={{
          outline: "none",
          bg: bg,
          border: "1px solid",
          borderColor: "blue.500",
        }}
        bg={searchBg}
        borderColor={searchBorder}
        height="36px"
        borderRadius={4}
        mr={4}
        onClick={onClick}
      />
      <Icon
        as={IoImageOutline}
        fontSize={24}
        mr={4}
        color="gray.400"
        cursor="pointer"
      />
      <Icon as={BsLink45Deg} fontSize={24} color="gray.400" cursor="pointer" />
    </Flex>
  );
};
export default CreatePostLink;
