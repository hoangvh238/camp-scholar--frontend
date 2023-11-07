import {
  Box,
  Flex,
  Icon,
  MenuItem,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { GrAdd } from "react-icons/gr";
import { useRecoilValue } from "recoil";

import { RootState } from "@/redux/store";
import { GiCampingTent } from "react-icons/gi";
import { useSelector } from "react-redux";
import { CommunityState } from "../../atoms/CommunitiesAtom";
import CreateCommunityModel from "../../components/Modal/CreateCommunity/CreateCommunityModel";
import MenuListItem from "./MenuListItem";

type CommunitiesProps = {};

const Communities: React.FC<CommunitiesProps> = () => {
  const [open, setOpen] = useState(false);
  const mySnippets = useRecoilValue(CommunityState).mySnippets;
  const hoverBg = useColorModeValue("gray.200", "#2A4365");
  const textColor = useColorModeValue("gray.500", "gray.400");
  const point = useSelector((state: RootState) => state.userInfor.userPoint);

  return (
    <>
      <CreateCommunityModel open={open} handleClose={() => setOpen(false)} />

      <Box mt={3} mb={4}>
        <Text pl={3} mb={1} fontSize="12px" fontWeight={500} color={textColor}>
          Nhóm của tôi
        </Text>
        {mySnippets && mySnippets.length > 0 && (
          <>
            {mySnippets
              .filter((item) => item.isModerator)
              .map((snippet) => (
                <MenuListItem
                  key={snippet.groupId}
                  icon={GiCampingTent}
                  displayText={`${snippet.groupName}`}
                  link={`/group/${snippet.groupId}`}
                  iconColor={"brand.100"}
                  imageURL={snippet.imageURLGAvatar}
                />
              ))}
          </>
        )}
      </Box>

      <Box mt={3} mb={4} height={20}>
        <Text pl={3} mb={1} fontSize="12px" fontWeight={500} color={textColor}>
          Nhóm đã tham gia
        </Text>
        {point.activityPoint > 1000 && (
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
              Tạo nhóm
            </Flex>
          </MenuItem>
        )}
        {mySnippets && mySnippets.length > 0 && (
          <>
            {mySnippets
              .filter((item) => !item.isModerator)
              .map((snippet) => (
                <MenuListItem
                  key={snippet.groupId}
                  icon={GiCampingTent}
                  displayText={`${snippet.groupName}`}
                  link={`/group/${snippet.groupId}`}
                  iconColor={"brand.100"}
                  imageURL={snippet.imageURLGAvatar}
                />
              ))}
          </>
        )}
        {mySnippets &&
          mySnippets.map((snippet) => (
            <MenuListItem
              key={snippet.groupId}
              icon={GiCampingTent}
              displayText={`${snippet.groupName}`}
              link={`/group/${snippet.groupId}`}
              iconColor={"blue.500"}
              imageURL={snippet.imageURLGAvatar}
            />
          ))}
      </Box>
    </>
  );
};
export default Communities;
