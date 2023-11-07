import {
  Avatar,
  Button,
  CircularProgress,
  CircularProgressLabel,
  Flex,
  Icon,
  Image,
  Stack,
  Text,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";

import { User } from "@/atoms/userAtom";
import { RootState } from "@/redux/store";
import { Timestamp } from "firebase/firestore";
import { useState } from "react";
import { FaMedal, FaUserCheck } from "react-icons/fa";
import { IoShirtOutline } from "react-icons/io5";
import { MdVerified } from "react-icons/md";
import { useSelector } from "react-redux";
import { useSetRecoilState } from "recoil";
import { authModelState } from "../../atoms/authModalAtom";
import useDirectory from "../../hooks/useDirectory";
import EditProfileModal from "../Modal/EditProfile/EditProfileModal";
interface RedditUserDocument {
  userId?: string;
  userName: string;
  userEmail?: string;
  userImage: string;
  redditImage: string;
  timestamp: Timestamp;
}

type Props = {
  userData: User;
  totalGroup: number;
};

function ProfileSide({ userData, totalGroup }: Props) {
  const [open, setOpen] = useState(false);
  const user = useSelector((state: RootState) => state.userInfor.currentUser);
  const [redditUser, setRedditUser] = useState<RedditUserDocument>();
  const { toggleMenuOpen } = useDirectory();
  const setAuthModelState = useSetRecoilState(authModelState);
  const bg = useColorModeValue("white", "#1A202C");
  const borderColor = useColorModeValue("gray.300", "#2D3748");
  const coint = useSelector((state: RootState) => state.userInfor.userCoint);
  const point = useSelector((state: RootState) => state.userInfor.userPoint);

  const onClick = () => {
    toggleMenuOpen();
  };

  const levelTag = [
    "Người mới",
    "Chuyên cần",
    "Chuyên sâu",
    "Chuyên gia",
    "Chuyên gia ưu tú",
  ];
  const levelColor = ["gray", "green", "blue", "yellow", "red"];
  const depcriptions = [
    "Cấp độ 1 : Cấp độ ban đầu của người dùng mới",
    "Cấp độ 2 : Cấp độ của người dùng tích cực hoạt động trong hệ thống",
    "Cấp độ 3 : Cấp độ của người dùng được mọi người đánh giá tốt trong hệ thống",
    "Cấp độ 4 : Cấp độ người dùng có độ uy tín cao, được mọi người đánh giá cao trong hệ thống",
    "Cấp độ 5: Cấp độ người dùng cao nhất, được đánh giá trên mức cao nhất của hệ thống",
  ];

  const getLevel = (point: number) => {
    if (point < 1000) {
      return 0;
    } else if (point < 2000) {
      return 1;
    } else if (point < 3000) {
      return 2;
    } else if (point < 4000) {
      return 3;
    } else {
      return 4;
    }
  };

  return (
    <Flex
      direction="column"
      bg={bg}
      borderRadius={4}
      cursor="pointer"
      border="1px solid"
      borderColor={borderColor}
    >
      <EditProfileModal
        open={open}
        handleClose={() => setOpen(false)}
        user={userData}
      />
      <Flex
        align="flex-end"
        justify="center"
        color="white"
        p="6px 10px"
        bg="blue.500"
        height="140px"
        borderRadius="4px 4px 0px 0px"
        fontWeight={600}
        bgImage="url(/images/recCommsArt.png)"
        backgroundSize="cover"
        bgGradient="linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.75)),
        url('https://source.unsplash.com/1600x900/?nature,photography,technolog')"
      ></Flex>
      <Flex justify="center">
        {userData.avatarURL ? (
          <Image
            src={userData.avatarURL}
            rounded="md"
            minWidth={"110px"}
            height="100px"
            mt="-50px"
            border="4px"
            borderColor="#fff"
          />
        ) : (
          <Avatar
            src={redditUser?.redditImage}
            name={
              userData?.userName || (userData?.email?.split("@")[0] as string)
            }
            width="80px"
            height="80px"
            mt="-50px"
            rounded="md"
          />
        )}
      </Flex>

      <Flex
        position="relative"
        align="center"
        justify="center"
        fontSize="10pt"
        fontWeight={600}
      >
        <Flex align="center" justify="center" gap={2}>
          <Text fontWeight="bold" fontSize="18pt">
            {userData?.userName || userData?.email?.split("@")[0]}
          </Text>
        </Flex>
      </Flex>
      <Text fontWeight="bold" fontSize="8pt" textAlign="center">
        {user.userId == userData.userId ? userData?.email : ""}
      </Text>
      {user.userId == userData.userId ? (
        <Button
          width={80}
          mt={2}
          mb={2}
          ml="auto"
          mr="auto"
          height="30px"
          // bg="brand.100"
          bgGradient="linear(to-r, brand.100, brand.100, yellow.500)"
          _hover={{
            bgGradient: "linear(to-r, yellow.500, brand.100, yellow.200)",
          }}
          display="flex"
          justifyContent="start"
          gap={10}
          onClick={() => {
            setOpen(true);
          }}
        >
          <Icon as={IoShirtOutline} />
          Chỉnh sửa thông tin cá nhân
        </Button>
      ) : (
        ""
      )}
      <Flex justify="center" gap={20} pt={5} pb={5}>
        <Stack>
          <Stack>
            <Text fontWeight="bold" fontSize="10pt" textAlign="start">
              Coint
            </Text>
            <Text
              fontWeight="medium"
              fontSize="9pt"
              p="auto"
              display="flex"
              gap={1}
            >
              <Icon
                as={MdVerified}
                color="blue.500"
                textAlign="center"
                mt="auto"
                mb="auto"
              />
              {user.userId == userData.userId ? coint.coint : "*"}
            </Text>
          </Stack>
          <Stack>
            <Text fontWeight="bold" fontSize="10pt" textAlign="start">
              Nhóm đã tham gia
            </Text>
            <Text
              fontWeight="medium"
              fontSize="9pt"
              p="auto"
              display="flex"
              gap={1}
            >
              <Icon
                as={FaUserCheck}
                color="blue.500"
                textAlign="center"
                mt="auto"
                mb="auto"
              />
              {totalGroup}
            </Text>
          </Stack>
        </Stack>
        <Stack>
          <Text fontWeight="bold" fontSize="10pt" textAlign="start">
            Cấp độ
          </Text>
          <Stack>
            <Tooltip
              label={`${depcriptions[getLevel(userData.activityPoint)]}`}
              fontSize="md"
            >
              <span>
                <CircularProgress
                  value={(userData.activityPoint % 1000) / 10} // Sử dụng phần dư để tính giá trị tiến trình trong khoảng từ 0 đến 100
                  color={levelColor[getLevel(userData.activityPoint)]}
                >
                  <CircularProgressLabel>
                    {`${(userData.activityPoint % 1000) / 10}%`}
                  </CircularProgressLabel>
                </CircularProgress>
              </span>
            </Tooltip>
          </Stack>
          <div className="w-full flex justify-center ">
            <Tooltip
              label={levelTag[getLevel(userData.activityPoint)]}
              fontSize="md"
            >
              <span>
                <FaMedal
                  className="w-6 h-6"
                  color={levelColor[getLevel(userData.activityPoint)]}
                ></FaMedal>
              </span>
            </Tooltip>
          </div>
        </Stack>
      </Flex>
      {user.userId == userData.userId ? (
        <>
          {" "}
          <Flex width="350px" pr={5} pl={5} gap={5} justify="center">
            <Text textAlign="center" fontSize="9pt">
              Bạn có nội dung gì mới ?
            </Text>
          </Flex>
          <Button
            width={80}
            mt={2}
            mb={2}
            ml="auto"
            mr="auto"
            height="30px"
            display="flex"
            justifyContent="center"
            rounded="md"
            onClick={onClick}
          >
            Nhóm của tôi
          </Button>
        </>
      ) : (
        ""
      )}
    </Flex>
  );
}

export default ProfileSide;
