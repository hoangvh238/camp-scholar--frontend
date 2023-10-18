import {
  Box,
  Flex,
  Icon,
  MenuItem,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { FaReddit } from "react-icons/fa";
import { GrAdd } from "react-icons/gr";
import { useRecoilValue } from "recoil";

import { CommunityState } from "../../atoms/CommunitiesAtom";
import CreateCommunityModel from "../../components/Modal/CreateCommunity/CreateCommunityModel";
import MenuListItem from "./MenuListItem";

type CommunitiesProps = {};

const ChoiceCommunity: React.FC<CommunitiesProps> = () => {
  const [open, setOpen] = useState(false);
  const mySnippets = useRecoilValue(CommunityState).mySnippets;
  const hoverBg = useColorModeValue("gray.200", "#2A4365");
  const textColor = useColorModeValue("gray.500", "gray.400");

  return (
    <>
      <Box mt={3} mb={4}>
        <Text pl={3} mb={1} fontSize="7pt" fontWeight={500} color={textColor}>
          Nhóm của tôi
        </Text>
        <MenuItem
          width="100%"
          fontSize="10pt"
          _hover={{ bg: hoverBg }}
          onClick={() => {
            setOpen(true);
          }}
        >
          <Flex align="center">
            <Icon as={GrAdd} mr={2} color="white" />
            Tạo nhóm mới
          </Flex>
        </MenuItem>
          {mySnippets && mySnippets.length > 0 && (
          <>
            {mySnippets
              .filter((item) => item.isModerator)
              .map((snippet) => (
                <MenuListItem
                  key={snippet.groupId}
                  icon={FaReddit}
                  displayText={`r/${snippet.groupName}`}
                  link={`/group/${snippet.groupId}`}
                  iconColor={"brand.100"}
                  imageURL={snippet.imageURLGAvatar}
                />
              ))}
          </>
        )}
        {mySnippets && mySnippets.map((snippet) => (
          <MenuListItem
            key={snippet.groupId}
            icon={FaReddit}
            displayText={`r/${snippet.groupName}`}
            link={`/group/${snippet.groupId}`}
            iconColor={"blue.500"}
            imageURL={snippet.imageURLGAvatar}
          />
        ))}
        
      </Box>
    </>
  );
};
export default ChoiceCommunity;
