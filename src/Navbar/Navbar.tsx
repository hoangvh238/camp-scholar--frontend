"use client";
import {
  UserCoint,
  UserPoint,
  store,
  updateCoint,
  updatePoint,
} from "@/redux/slices/userInfor";
import { Flex, Image, useColorMode, useColorModeValue } from "@chakra-ui/react";
import { getCookie } from "cookies-next";
import { Timestamp } from "firebase/firestore";
import jwt_decode from "jwt-decode";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getCoint, getPoint } from "../../apis/profile";
import { defaultMenuItem } from "../atoms/directoryMenuAtom";
import useDirectory from "../hooks/useDirectory";
import Directory from "./Directory/Directory";
import RightContent from "./RightContent/RightContent";
import SearchInput from "./SearchInput";

interface RedditUserDocument {
  userId?: string;
  userName: string;
  userEmail?: string;
  userImage: string;
  redditImage: string;
  timestamp: Timestamp;
}
type UserBase = {
  userName: string;
  userId: number;
  role: string;
};

const Navbar: React.FC = () => {
  const [userCreates, setUserCreate] = useState<boolean>(false);
  const { onSelectMenuItem } = useDirectory();
  const { colorMode } = useColorMode();
  const bg = useColorModeValue("white", "gray.800");
  const dispatch = useDispatch();
  const [user, setUser] = useState<UserBase>();
  const storage = async () => {
    const token = getCookie("token");

    if (!token) return null;

    var decoded: UserBase = jwt_decode(token);
    const user = {
      userId: decoded!.userId,
      userName: decoded!.userName,
      role: decoded!.role,
    };
    setUser(user);
    dispatch(
      store({
        user,
      }),
    );
    try {
      const getDBCoint = await getCoint();
      const getDBPoint = await getPoint();
      const coint: UserCoint = {
        coint: getDBCoint.data.data,
      };
      const point: UserPoint = {
        activityPoint: getDBPoint.data.data,
      };
      dispatch(
        updateCoint({
          coint,
        }),
      );
      dispatch(
        updatePoint({
          point,
        }),
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    storage();
  }, []);

  return (
    <Flex
      bg={bg}
      height="50px"
      paddingY={"6px"}
      paddingRight={"10px"}
      width="100%"
      position={"fixed"}
      zIndex={"999"}
      justify={{ md: "space-between" }}
      borderBottom={"1px"}
      borderColor={"gray.300"}
    >
      <Flex
        align="center"
        width={{ base: "40px", md: "auto" }}
        mr={{ base: 0, md: 2 }}
        cursor="pointer"
        onClick={() => onSelectMenuItem(defaultMenuItem)}
      >
        <Image src="/images/campLogo.gif" height="90px" />
      </Flex>
      {user && <Directory />}
      <SearchInput user={user} />
      <RightContent user={user} />
    </Flex>
  );
};
export default Navbar;
