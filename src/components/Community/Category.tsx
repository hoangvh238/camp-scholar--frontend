import {
  Avatar,
  Box,
  Divider,
  Flex,
  Icon,
  Stack,
  Tag,
  TagLabel,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { RiCakeLine } from "react-icons/ri";
import { formatTimeToNow } from "../../../ultils/utils";
import { Community } from "../../atoms/CommunitiesAtom";

type AboutProps = {
  communityData: Community;
};

const Category: React.FC<AboutProps> = ({ communityData }) => {
  const bg = useColorModeValue("white", "#1A202C");
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
            <Tag size="lg" colorScheme="red" borderRadius="full">
              <Avatar
                src="https://bit.ly/sage-adebayo"
                size="xs"
                name="Segun Adebayo"
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
                  Created {formatTimeToNow(new Date(communityData.timeCreate))}
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
