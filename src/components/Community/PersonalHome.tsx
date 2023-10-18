import {
  Button,
  Flex,
  Icon,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { FaReddit } from "react-icons/fa";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/clientApp";
import CreateCommunityModel from "../Modal/CreateCommunity/CreateCommunityModel";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const PersonalHome: React.FC = () => {
  const user= useSelector((state:RootState) => state.userInfor.currentUser)
  const [open, setOpen] = useState(false);
  const bg = useColorModeValue("white", "#1A202C");
  const borderColor = useColorModeValue("gray.300", "#2D3748");

  return (
    <Flex
      direction="column"
      bg={bg}
      borderRadius={4}
      cursor="pointer"
      border="1px solid"
      borderColor={borderColor}
      position="sticky"
    >
      <CreateCommunityModel open={open} handleClose={() => setOpen(false)} />
      <Flex
        align="flex-end"
        color="white"
        p="6px 10px"
        bg="blue.500"
        height="34px"
        borderRadius="4px 4px 0px 0px"
        fontWeight={600}
        bgImage="url(/images/sgf6r5easbh31.jpg)"
        backgroundSize="cover"
      ></Flex>
      <Flex direction="column" p="12px">
        <Flex align="center" mb={2}>
         
          <Text fontWeight={600}>Có gì mới ?</Text>
        </Flex>
        <Stack spacing={3}>
          <Text fontSize="9pt">
            Nói tôi bạn muốn gì ?
          </Text>
          <Button height="30px">Tạo bài viết</Button>
         {user?.role.includes("MEMBER") ?   <Button
            disabled={!user.userName}
            variant="outline"
            height="30px"
            onClick={() => {
              setOpen(true);
            }}
          >
            Tạo nhóm
          </Button> : null}
        </Stack>
      </Flex>
    </Flex>
  );
};
export default PersonalHome;
