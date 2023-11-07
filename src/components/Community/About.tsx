import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Icon,
  Stack,
  Tag,
  TagLabel,
  Text,
  Wrap,
  WrapItem,
  useColorModeValue,
} from "@chakra-ui/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { AiFillTags } from "react-icons/ai";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { RiCakeLine } from "react-icons/ri";
import { useSetRecoilState } from "recoil";
import { getTotalMember } from "../../../apis/groups";
import { formatTimeToNow } from "../../../ultils/utils";
import { Community, CommunityState } from "../../atoms/CommunitiesAtom";
import useSelectFile from "../../hooks/useSelectFile";

type AboutProps = {
  communityData: Community;
};

const About: React.FC<AboutProps> = ({ communityData }) => {
  const { selectedFile } = useSelectFile();
  const [uploadingImage, setUploadingImage] = useState(false);
  const setCommunityStateValue = useSetRecoilState(CommunityState);
  const bg = useColorModeValue("white", "#1A202C");
  const [totalMember, setTotalMember] = useState(0);

  const getTotalMemberDB = async () => {
    try {
      const getDb = await getTotalMember(communityData.groupId);
      const data = getDb.data.data;
      setTotalMember(data);
    } catch (error) {
      console.log(error);
    }
  };

  const onUploadingImage = async () => {
    if (!selectedFile) return;
    setUploadingImage(true);
    let url: string = "";
    try {
      if (selectedFile !== null) {
        const PRESET = "camp_scholar";
        const COULD_NAME = "ds0av2boe";
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("upload_preset", PRESET); // Create an upload preset in Cloudinary

        // Make a POST request to Cloudinary's upload endpoint
        fetch(`https://api.cloudinary.com/v1_1/${COULD_NAME}/image/upload`, {
          method: "POST",
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => {
            // `data.url` contains the URL of the uploaded image on Cloudinary
            url = data.url;
          })
          .catch((error) => {
            console.error("Error uploading image to Cloudinary", error);
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

  useEffect(() => {
    getTotalMemberDB();
  }, []);
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
                  Tạo vào {formatTimeToNow(new Date(communityData.timeCreate))}
                </Text>
              </>
            )}
          </Flex>
          <Link href={`/group/submit`}>
            <Button mt={3} height="30px">
              Tạo bài viết
            </Button>
          </Link>
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
            <Flex
              width="100%"
              p={2}
              fontSize="10pt"
              fontWeight={700}
              justify={"center"}
            >
              <Tag size="lg" colorScheme="telegram" borderRadius="full">
                <Avatar
                  size="xs"
                  name={communityData.category}
                  ml={-1}
                  mr={2}
                />
                <TagLabel>{communityData.category}</TagLabel>
              </Tag>
            </Flex>
            <div className="text-center">
              <Text maxWidth={"400px"}>{communityData.description}</Text>
            </div>
            <Divider />

            <Wrap spacing="10px" maxWidth={"400px"}>
              {communityData.hashtag.split(",").map((value: string) => (
                <WrapItem key={value}>
                  <Tag
                    size={"lg"}
                    key={"lg"}
                    variant="solid"
                    colorScheme="telegram"
                    gap={2}
                  >
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
