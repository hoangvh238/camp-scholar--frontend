import {
  Box,
  Button,
  Divider,
  Flex,
  Icon,
  Image,
  List,
  ListIcon,
  ListItem,
  Spinner,
  Stack,
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
import { MdCheckCircle, MdSettings } from "react-icons/md";

type AboutProps = {
  communityData: Community;
};

const Rule: React.FC = () => {
  const user = useSelector((state: RootState) => state.userInfor.currentUser)
  const selectedFieldRef = useRef<HTMLInputElement>(null);
  const { selectedFile, setSelectedFile, onSelectedFile } = useSelectFile();
  const [uploadingImage, setUploadingImage] = useState(false);
  const setCommunityStateValue = useSetRecoilState(CommunityState);
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
          Bộ quy tắc về đăng bài của Camp Scholar
        </Text>
        <Icon as={HiOutlineDotsHorizontal} cursor="pointer" />
      </Flex>
      <Flex direction="column" p={3} bg={bg} borderRadius="0px 0px 4px 4px">
        <Stack>
          <Flex width="100%" p={2} fontSize="10pt" fontWeight={700}>
            <Flex direction="column" flexGrow={1}>
              <Text>Quy định chung về việc đăng bài trong Camp Scholar </Text>
            </Flex>
            <Flex direction="column" flexGrow={1}>

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
            <List spacing={4}>
              <ListItem>
                <ListIcon as={MdCheckCircle} color='green.500' />
                Bạn phải đảm bảo rằng mọi thông tin trong bài viết của bạn là chính xác và không được chứa thông tin sai lệch hoặc lừa dối.
              </ListItem>
              <ListItem>
                <ListIcon as={MdCheckCircle} color='green.500' />
                Hãy tuân thủ luật bản quyền và chỉ sử dụng tài liệu, hình ảnh, hoặc dữ liệu từ nguồn có sự cho phép.
              </ListItem>
              <ListItem>
                <ListIcon as={MdCheckCircle} color='green.500' />
                Xin vui lòng tôn trọng quyền riêng tư của người khác và không đăng tải thông tin cá nhân của họ mà không có sự cho phép.
              </ListItem>
              {/* You can also use custom icons from react-icons */}
              <ListItem>
                <ListIcon as={MdSettings} color='green.500' />
                Nếu bạn đăng quảng cáo hoặc nội dung tài trợ, xin vui lòng tuân theo quy định liên quan và đảm bảo rằng nó không làm ảnh hưởng đến tính chất chất lượng của trang web.
              </ListItem>
              <ListItem>
                <ListIcon as={MdSettings} color='green.500' />
                Sử dụng ngôn ngữ và biểu đạt chuyên nghiệp, lịch sự, và rõ ràng trong bài viết của bạn.
              </ListItem>
            </List>
          </Flex>

        </Stack>
      </Flex>
    </Box>
  );
};
export default Rule;
