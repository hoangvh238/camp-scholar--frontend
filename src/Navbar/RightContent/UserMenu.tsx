import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Switch,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import React from "react";
import { CgProfile } from "react-icons/cg";
import { FaFreeCodeCamp } from "react-icons/fa";
import { MdOutlineLogin } from "react-icons/md";
import { VscAccount } from "react-icons/vsc";

import Level from "@/components/common/Level";
import { logout } from "@/redux/slices/userInfor";
import { RootState } from "@/redux/store";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { useSetRecoilState } from "recoil";
import { authModelState } from "../../atoms/authModalAtom";

type UserBase = {
  userName: string;
  role: string;
};

type UserMenuProps = {
  user?: UserBase | null;
};

const UserMenu: React.FC<UserMenuProps> = ({ user }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const setAuthModalState = useSetRecoilState(authModelState);
  const { colorMode, toggleColorMode } = useColorMode();
  const point = useSelector((state: RootState) => state.userInfor.userPoint);

  const handelNavigatePage = () => {
    if (user) {
      router.push({
        pathname: `/profile/${user?.userName}`,
      });
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    window.location.reload();
  };

  return (
    <Menu>
      <MenuButton
        cursor="pointer"
        padding="0px 6px"
        borderRadius={4}
        _hover={{ outline: "1px solid", outlineColor: "gray.200" }}
      >
        <Flex align="center">
          <Flex align="center">
            {user ? (
              <>
                <Icon
                  fontSize={24}
                  mr={4}
                  color="red.400"
                  as={FaFreeCodeCamp}
                />
                <Flex
                  display={{ base: "none", lg: "flex" }}
                  flexDirection="column"
                  fontSize="8pt"
                  alignItems="flex-start"
                  mr={8}
                >
                  <Text fontWeight={700}>{user?.userName}</Text>
                  <Flex alignItems="center">
                    <Level point={point.activityPoint}></Level>
                  </Flex>
                </Flex>
              </>
            ) : (
              <Icon fontSize={24} color="gray.400" as={VscAccount} />
            )}
          </Flex>
          <ChevronDownIcon />
        </Flex>
      </MenuButton>
      <MenuList mt={2}>
        <MenuItem fontSize="10pt" fontWeight="700" closeOnSelect={false}>
          <Flex gap={2} align="center">
            <Switch
              isChecked={colorMode === "dark" ? true : false}
              onChange={toggleColorMode}
            />
            <Text>Dark Mode</Text>
          </Flex>
        </MenuItem>
        {user ? (
          <>
            <MenuDivider />
            <MenuItem
              fontSize="10px"
              fontWeight={700}
              _hover={{ bg: "blue.500", color: "white" }}
            >
              <Flex align="center" onClick={handelNavigatePage}>
                <Icon fontSize={20} mr={2} as={CgProfile} />
                Hồ sơ
              </Flex>
            </MenuItem>
            <MenuDivider />
            <MenuItem
              fontSize="10px"
              fontWeight={700}
              _hover={{ bg: "blue.500", color: "white" }}
              onClick={handleLogout}
            >
              <Flex align="center">
                <Icon fontSize={20} mr={2} as={MdOutlineLogin} />
                 Đăng xuất
              </Flex>
            </MenuItem>
          </>
        ) : (
          <>
            <MenuItem
              fontSize="10px"
              fontWeight={700}
              _hover={{ bg: "blue.500", color: "white" }}
              onClick={() => setAuthModalState({ open: true, view: "login" })}
            >
              <Flex align="center">
                <Icon fontSize={20} mr={2} as={MdOutlineLogin} />
                Log In / Sign Up
              </Flex>
            </MenuItem>
          </>
        )}
      </MenuList>
    </Menu>
  );
};
export default UserMenu;
