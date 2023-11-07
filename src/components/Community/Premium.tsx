import {
  Button,
  Flex,
  Image,
  List,
  ListIcon,
  ListItem,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { MdCheckCircle, MdSettings } from "react-icons/md";

const Premium: React.FC = () => {
  const bg = useColorModeValue("white", "#1A202C");
  const borderColor = useColorModeValue("gray.300", "#2D3748");

  return (
    <Flex
      direction="column"
      bg={bg}
      borderRadius={4}
      cursor="pointer"
      p="12px"
      border="1px solid"
      borderColor={borderColor}
    >
      <Flex mb={2}>
        <Image src="/images/fires.gif" height="100px" />
        <Stack spacing={1} fontSize="9pt" pl={2}>
          <Flex mb={2}>
            <Stack spacing={1} fontSize="9pt" pl={2}>
              <Text fontWeight={600} fontSize={"14px"}>
                Tham gia Camp Scholar PRO
              </Text>
              <Text className="text-[12px] font-bold font-italic">
                Trải nghiệm Camp Scholar với 🚀
              </Text>
              <List spacing={3}>
                <ListItem>
                  <ListIcon as={MdCheckCircle} color="green.500" />
                  Tìm kiếm nội dung với AI 🔍
                </ListItem>
                <ListItem>
                  <ListIcon as={MdCheckCircle} color="green.500" />
                  Tương tác, hỏi đáp PDF với AI 💬
                </ListItem>
                <ListItem>
                  <ListIcon as={MdCheckCircle} color="green.500" />
                  Giao diện tối tốt cho việc đọc bài 🌙
                </ListItem>
                <ListItem>
                  <ListIcon as={MdSettings} color="green.500" />
                  Chỉ với 50 Xu một tháng 💰
                </ListItem>
              </List>
            </Stack>
          </Flex>
        </Stack>
      </Flex>
      <Button height="30px" bg="brand.100">
        Thử ngay
      </Button>
    </Flex>
  );
};
export default Premium;
