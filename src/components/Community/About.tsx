import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  HStack,
  Icon,
  Image,
  Spinner,
  Stack,
  Tag,
  TagCloseButton,
  TagLabel,
  Text,
  Wrap,
  WrapItem,
  useColorModeValue,
} from "@chakra-ui/react";
import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import moment from "moment";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { FaReddit } from "react-icons/fa";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { RiCakeLine } from "react-icons/ri";
import { AiFillTags } from "react-icons/ai";
import { useSetRecoilState } from "recoil";
import { formatTimeToNow } from "../../../ultils/utils";
import { Community, CommunityState } from "../../atoms/CommunitiesAtom";
import { auth, firestore, storage } from "../../firebase/clientApp";
import useSelectFile from "../../hooks/useSelectFile";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { getTotalMember } from "../../../apis/groups";

type AboutProps = {
  communityData: Community;
};

const About: React.FC<AboutProps> = ({ communityData }) => {
  const user = useSelector((state: RootState) => state.userInfor.currentUser)
  const selectedFieldRef = useRef<HTMLInputElement>(null);
  const { selectedFile, setSelectedFile, onSelectedFile } = useSelectFile();
  const [uploadingImage, setUploadingImage] = useState(false);
  const setCommunityStateValue = useSetRecoilState(CommunityState);
  const bg = useColorModeValue("white", "#1A202C");
  const [totalMember,setTotalMember] = useState(0);

  const getTotalMemberDB = async () => {
    const getDb = await getTotalMember(communityData.groupId);
    const data = getDb.data.data;
    setTotalMember(data);
  }
  console.log("test" + communityData.host + "aaa" + user.userName);


  const onUploadingImage = async () => {
    if (!selectedFile) return;
    setUploadingImage(true);
    let url: string = "";
    try {
      if (selectedFile !== null) {
        const PRESET = "camp_scholar";
        const COULD_NAME = 'ds0av2boe'
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('upload_preset', PRESET); // Create an upload preset in Cloudinary

        // Make a POST request to Cloudinary's upload endpoint
        fetch(`https://api.cloudinary.com/v1_1/${COULD_NAME}/image/upload`, {
          method: 'POST',
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => {
            // `data.url` contains the URL of the uploaded image on Cloudinary
            url = data.url;
          })
          .catch((error) => {
            console.error('Error uploading image to Cloudinary', error);
          });
      }

      setCommunityStateValue((prev) => ({
        ...prev,
        currentCommunity: {
          ...prev.currentCommunity,
          imageURLGAvatar: url,
        } as Community,
      }));
    } catch (error) {
      console.log("onUploader Image", error);
    }
    setUploadingImage(false);
  };

  useEffect(()=>{
    getTotalMemberDB();
  },[])
  return (
    <Box position="sticky" top="70px">
      <Flex
        justify="space-between"
        align="center"
        bg="blue.400"
        color="white"
        p={3}
        borderRadius="4px 4px 0px 0px"
      >
        <Text fontSize="10pt" fontWeight={700}>
          About Community
        </Text>
        <Icon as={HiOutlineDotsHorizontal} cursor="pointer" />
      </Flex>
      <Flex direction="column" p={3} bg={bg} borderRadius="0px 0px 4px 4px">
        <Stack>
          <Flex width="100%" p={2} fontSize="10pt" fontWeight={700}>
            <Flex direction="column" flexGrow={1}>
              <Text>{totalMember}</Text>
              <Text>Thành viên</Text>
            </Flex>
            <Flex direction="column" flexGrow={1}>
              <Text>1</Text>
              <Text>Online</Text>
            </Flex>
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
                  Tạo vào {" "}
                  {formatTimeToNow(new Date(communityData.timeCreate))}
                </Text>
              </>
            )}
          </Flex>
          <Link href={`/group/submit`}>
            <Button mt={3} height="30px">
              Tạo bài viết
            </Button>
          </Link>
          {user?.userName === communityData.host && (
            <>
              <Divider />
              <Stack spacing={1} fontSize="10pt">
                <Text fontWeight={600}>Admin</Text>
                <Flex align="center" justify="space-between">
                  <Text
                    color="blue.500"
                    cursor="pointer"
                    _hover={{ textDecoration: "underline" }}
                    onClick={() => selectedFieldRef.current?.click()}
                  >
                    Change Image
                  </Text>
                  {communityData.imageURLGAvatar || selectedFile ? (
                    <Image
                      src={communityData.imageURLGAvatar}
                      borderRadius="full"
                      boxSize="40px"
                      alt="community Image"
                    />
                  ) : (
                    <Icon
                      as={FaReddit}
                      fontSize={40}
                      color="brand.100"
                      mr={2}
                    />
                  )}
                </Flex>
                {selectedFile &&
                  (uploadingImage ? (
                    <Spinner />
                  ) : (
                    <Text cursor="pointer" onClick={onUploadingImage}>
                      Save Changes
                    </Text>
                  ))}
                <input
                  id="file-upload"
                  type="file"
                  accept="image/x-png,image/gif,image/jpeg"
                  hidden
                  ref={selectedFieldRef}
                  onChange={onSelectedFile}
                />
              </Stack>
            </>
          )}
        </Stack>
      </Flex>

      <Box marginTop={"7"}>
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
            <Flex width="100%" p={2} fontSize="10pt" fontWeight={700} justify={"center"}>
              <Tag size='lg' colorScheme='telegram' borderRadius='full'>
                <Avatar
                  size='xs'
                  name={communityData.category}
                  ml={-1}
                  mr={2}
                />
                <TagLabel>{communityData.category}</TagLabel>
              </Tag>
              
            </Flex>
            <div className="text-center"><Text maxWidth={"400px"}>{communityData.description}</Text></div>
            <Divider />

            <Wrap  spacing='10px' maxWidth={"400px"}>
            {communityData.hashtag.split(',').map((value:string) => (
                  <WrapItem>
                    <Tag size={"lg"} key={"lg"} variant='solid' colorScheme='telegram' gap={2}>
                      <AiFillTags></AiFillTags>
                      {value}
                    </Tag>
                  </WrapItem>

                ))}
            </Wrap>


          </Stack>
        </Flex>
      </Box>
    </Box>
  );
};
export default About;
