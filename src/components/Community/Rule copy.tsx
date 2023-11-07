import {
  Box,
  Divider,
  Flex,
  Icon,
  List,
  ListIcon,
  ListItem,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { MdCheckCircle, MdSettings } from "react-icons/md";

const CommentRule: React.FC = () => {
  const bg = useColorModeValue("white", "#1A202C");

  return (
    <Box position="sticky" top="14px">
      <Flex
        justify="space-between"
        align="center"
        bg="blue.400"
        color="white"
        p={3}
        borderRadius="4px 4px 0px 0px"
      >
        <Text fontSize="10pt" fontWeight={700}>
          Bộ quy tắc về bình luận của Camp Scholar
        </Text>
        <Icon as={HiOutlineDotsHorizontal} cursor="pointer" />
      </Flex>
      <Flex direction="column" p={3} bg={bg} borderRadius="0px 0px 4px 4px">
        <Stack>
          <Flex width="100%" p={2} fontSize="10pt" fontWeight={700}>
            <Flex direction="column" flexGrow={1}>
              <Text>Quy định chung về việc bình luận trong Camp Scholar </Text>
            </Flex>
            <Flex direction="column" flexGrow={1}></Flex>
          </Flex>
          <Divider />

          <Flex
            align="center"
            width="100%"
            p={1}
            fontWeight={500}
            fontSize="10pt"
          >
            <List spacing={4}>
              <ListItem>
                <ListIcon as={MdCheckCircle} color="green.500" />
                Tôn trọng người khác: Tránh dùng ngôn ngữ thô tục, xúc phạm hay
                xúc phạm người khác.
              </ListItem>
              <ListItem>
                <ListIcon as={MdCheckCircle} color="green.500" />
                Không spam: Không đăng nhiều bình luận liên quan đến cùng một
                chủ đề hoặc sản phẩm.
              </ListItem>
              <ListItem>
                <ListIcon as={MdCheckCircle} color="green.500" />
                Không quảng cáo: Không sử dụng bình luận để quảng bá sản phẩm
                hoặc dịch vụ của bạn.
              </ListItem>
              {/* You can also use custom icons from react-icons */}
              <ListItem>
                <ListIcon as={MdSettings} color="green.500" />
                Không chia sẻ thông tin cá nhân: Không chia sẻ thông tin cá nhân
                về bản thân hoặc người khác trong phần bình luận.
              </ListItem>
              <ListItem>
                <ListIcon as={MdSettings} color="green.500" />
                Không đăng nội dung không phù hợp: Không đăng nội dung không phù
                hợp, bao gồm nội dung liên quan đến chính trị, tôn giáo, tình
                dục hoặc bạo lực.
              </ListItem>
            </List>
          </Flex>
        </Stack>
      </Flex>
    </Box>
  );
};
export default CommentRule;
