import {
  Box,
  Button,
  Flex,
  Icon,
  Image,
  Skeleton,
  SkeletonCircle,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { GiForestCamp } from "react-icons/gi";
import { getSuggest } from "../../../apis/groups";
import { Community } from "../../atoms/CommunitiesAtom";
import useCommunityData from "../../hooks/useCommunityData";

const Recommendation: React.FC = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [isViewAll, setIsViewAll] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const { communityStateValue, onJoinOrCommunity } = useCommunityData();
  const bg = useColorModeValue("white", "#1A202C");
  const borderColor = useColorModeValue("gray.300", "#2D3748");

  const getCommunityRecommendation = async () => {
    setLoading(true);
    try {
      const communityDocs = await getSuggest();

      setCommunities(communityDocs.data);
    } catch (error) {
      console.log("getCommunityRecommendation", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!isViewAll) setCommunities([]);
    else getCommunityRecommendation();
  }, [isViewAll]);

  return (
    <Flex
      direction="column"
      bg={bg}
      borderRadius={4}
      cursor="pointer"
      border="1px solid"
      borderColor={borderColor}
    >
      <Flex
        align="flex-end"
        color="white"
        p="6px 10px"
        bg="blue.500"
        height="70px"
        borderRadius="4px 4px 0px 0px"
        fontWeight={600}
        bgImage="url(/images/recCommsArt.png)"
        backgroundSize="cover"
        bgGradient="linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.75)),
        url('images/xw6wqhhjubh31.webp')"
      >
        Những nhóm mà bạn có thể quan tâm
      </Flex>
      <Flex direction="column">
        {loading ? (
          <Stack mt={2} p={3}>
            <Flex justify="space-between" align="center">
              <SkeletonCircle size="10" />
              <Skeleton height="10px" width="70%" />
            </Flex>
            <Flex justify="space-between" align="center">
              <SkeletonCircle size="10" />
              <Skeleton height="10px" width="70%" />
            </Flex>
            <Flex justify="space-between" align="center">
              <SkeletonCircle size="10" />
              <Skeleton height="10px" width="70%" />
            </Flex>
          </Stack>
        ) : (
          <>
            {communities &&
              communities.map((item, index) => {
                const isJoined = !!communityStateValue.mySnippets.find(
                  (snippet) => snippet.groupId === item.groupId,
                );
                return (
                  <Link key={item.groupId} href={`/group/${item.groupId}`}>
                    <Flex
                      position="relative"
                      align="center"
                      fontSize="10pt"
                      borderBottom="1px solid"
                      borderColor={borderColor}
                      p="10px 12px"
                      fontWeight={600}
                    >
                      <Flex width="80%" align="center">
                        <Flex width="15%">
                          <Text mr={2}>{index + 1}</Text>
                        </Flex>
                        <Flex align="center" width="80%">
                          {item.imageURLGAvatar ? (
                            <Image
                              borderRadius="full"
                              boxSize="28px"
                              src={item.imageURLGAvatar}
                              mr={2}
                            />
                          ) : (
                            <Icon
                              as={GiForestCamp}
                              fontSize={30}
                              color="brand.100"
                              mr={2}
                            />
                          )}
                          <span
                            style={{
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >{`${item.groupName}`}</span>
                        </Flex>
                      </Flex>
                      <Box position="absolute" right="10px">
                        <Button
                          height="22px"
                          fontSize="8pt"
                          variant={isJoined ? "outline" : "solid"}
                        >
                          {isJoined ? "Joined" : "Join"}
                        </Button>
                      </Box>
                    </Flex>
                  </Link>
                );
              })}
            <Box p="10px 20px">
              <Button
                height="30px"
                width="100%"
                onClick={() =>
                  isViewAll ? setIsViewAll(false) : setIsViewAll(true)
                }
              >
                {isViewAll ? "Thu gọn" : "Xem tất cả"}
              </Button>
            </Box>
          </>
        )}
      </Flex>
    </Flex>
  );
};
export default Recommendation;
