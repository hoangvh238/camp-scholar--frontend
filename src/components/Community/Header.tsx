import {
  Box,
  Button,
  Flex,
  Icon,
  Image,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { Community } from "../../atoms/CommunitiesAtom";
import { FaReddit } from "react-icons/fa";
import useCommunityData from "../../hooks/useCommunityData";

type HeaderProps = {
  communityData: Community;
};

const Header: React.FC<HeaderProps> = ({ communityData }) => {
  const bg = useColorModeValue("white", "#1A202C");
  const { communityStateValue, onJoinOrCommunity, loading } =
    useCommunityData();
  const isJoined = !!communityStateValue.mySnippets.find(
    (item) => item.groupId === communityData?.groupId
  );
  console.log("data"+communityData.groupId);
  
  return (
    <Flex direction="column" width="100%" height="306px">
     <Flex
  align="flex-end"
  justify="center"
  color="white"
  p="6px 10px"
  bg="blue.500"
  height="90%"
  borderRadius="4px 4px 0px 0px"
  fontWeight={600}
  // Set the background image and size
  bgImage={`url(${communityData.imageUrlGCover})`}
  backgroundSize="cover"
  bgGradient="linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.75)),
  url('https://source.unsplash.com/1600x900/?nature,photography,technolog')"
>
  
</Flex>

      <Flex justifyContent="center" bg={bg} height="20%">
        <Flex width="95%" maxWidth="860px">
          {communityData.imageURLGAvatar ? (
            <Image
              borderRadius="full"
              boxSize="66px"
              src={communityData.imageURLGAvatar}
              alt="profile Image"
              position="relative"
              top={-3}
              color="blue.500"
              border="4px solid white"
            />
          ) : (
            <Icon
              as={FaReddit}
              fontSize={64}
              position="relative"
              top={-3}
              color="blue.500"
              border="4px solid white"
              borderRadius="50%"
            />
          )}
          <Flex padding="10px 16px">
            <Flex direction="column" mr={6}>
              <Text fontWeight={800} fontSize="16px">
                {communityData?.groupName}
              </Text>
              <Text fontWeight={600} fontSize="10px" color="gray.500">
                group/{communityData?.groupName}
              </Text>
            </Flex>
            <Button
              variant={isJoined ? "outline" : "solid"}
              height="30px"
              pr={6}
              pl={6}
              isLoading={loading}
              onClick={() => {
                onJoinOrCommunity(communityData, isJoined);
              }}
            >
              {isJoined ? "Rời nhóm" : "Tham gia"}
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
export default Header;
