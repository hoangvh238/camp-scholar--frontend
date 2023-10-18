import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Icon,
  Image,
  Spinner,
  Stack,
  Tag,
  TagLabel,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import moment from "moment";
import Link from "next/link";
import React, { useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { FaReddit } from "react-icons/fa";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { RiCakeLine } from "react-icons/ri";
import { useSetRecoilState } from "recoil";
import { formatTimeToNow } from "../../../ultils/utils";
import { Community, CommunityState } from "../../atoms/CommunitiesAtom";
import { auth, firestore, storage } from "../../firebase/clientApp";
import useSelectFile from "../../hooks/useSelectFile";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

type AboutProps = {
  communityData: Community;
};

const Category: React.FC<AboutProps> = ({ communityData }) => {
  const user = useSelector((state: RootState) => state.userInfor.currentUser)
  const selectedFieldRef = useRef<HTMLInputElement>(null);
  const { selectedFile, setSelectedFile, onSelectedFile } = useSelectFile();
  const [uploadingImage, setUploadingImage] = useState(false);
  const setCommunityStateValue = useSetRecoilState(CommunityState);
  const bg = useColorModeValue("white", "#1A202C");

  console.log("test" + communityData.host + "aaa" + user.userName);


  const onUploadingImage = async () => {
    if (!selectedFile) return;
    setUploadingImage(true);
    let url: string = "";

    setUploadingImage(false);
  };

  return (
    <Box position="sticky" top="200px">
      <Flex
        justify="space-between"
        align="center"
        bg="blue.400"
        color="white"
        p={3}
        borderRadius="4px 4px 0px 0px"
      >
        <Text fontSize="10pt" fontWeight={700}>
          Lĩnh vực hoạt động
        </Text>
        <Icon as={HiOutlineDotsHorizontal} cursor="pointer" />
      </Flex>
      <Flex direction="column" p={3} bg={bg} borderRadius="0px 0px 4px 4px">
        <Stack>
          <Flex width="100%" p={2} fontSize="10pt" fontWeight={700}>
            <Tag size='lg' colorScheme='red' borderRadius='full'>
              <Avatar
                src='https://bit.ly/sage-adebayo'
                size='xs'
                name='Segun Adebayo'
                ml={-1}
                mr={2}
              />
              <TagLabel>Segun</TagLabel>
            </Tag>
          </Flex>
          <Divider />

          <Flex
            align="center"
            width="100%"
            p={1}
            fontWeight={500}
            fontSize="10pt"
          >
            <Icon as={RiCakeLine} fontSize={18} mr={2} />
            {communityData.timeCreate && (
              <>
                <Text>
                  Created{" "}
                  {formatTimeToNow(new Date(communityData.timeCreate))}
                </Text>
              </>
            )}
          </Flex>


        </Stack>
      </Flex>
    </Box>
  );
};
export default Category;
