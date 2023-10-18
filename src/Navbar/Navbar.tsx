"use client"
import { Flex, Image, useColorMode, useColorModeValue } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import jwt_decode from "jwt-decode";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import { defaultMenuItem } from "../atoms/directoryMenuAtom";
import { auth, firestore } from "../firebase/clientApp";
import useDirectory from "../hooks/useDirectory";
import Directory from "./Directory/Directory";
import RightContent from "./RightContent/RightContent";
import SearchInput from "./SearchInput";
import { redditProfileImage } from "./store";
import { getCookie } from "cookies-next";
import { useDispatch } from "react-redux";
import { UserCoint, UserPoint, store, updateCoint, updatePoint } from "@/redux/slices/userInfor";
import { getCoint, getPoint } from "../../apis/profile";

interface RedditUserDocument {
  userId?: string;
  userName: string;
  userEmail?: string;
  userImage: string;
  redditImage: string;
  timestamp: Timestamp;
}
type UserBase = {
  userName: string,
  userId : number,
  role: string,
};

const Navbar: React.FC = () => {
  const [userCreates, setUserCreate] = useState<boolean>(false);
  const { onSelectMenuItem } = useDirectory();
  const { colorMode } = useColorMode();
  const bg = useColorModeValue("white", "gray.800");
  const dispatch = useDispatch();
  const [user,setUser] = useState<UserBase>();
  
  const storage = async () => {
    const token =  getCookie("token");

    if (!token) return null;

    var decoded: UserBase = jwt_decode(token);
    const user = {
      userId : decoded!.userId,
      userName: decoded!.userName,
      role: decoded!.role,
    };
    setUser(user);
    dispatch(
      store({
        user
      })
    );
    const getDBCoint = await getCoint();
    const getDBPoint = await getPoint();
    
    const coint:UserCoint = {
      coint :  getDBCoint.data.data
    }
    const point:UserPoint = {
      activityPoint : getDBPoint.data.data
    }
    dispatch(
      updateCoint({
        coint
      })
    );
    dispatch(
      updatePoint({
        point
      })
    );
  }
  
  useEffect(() => {
    storage();
  }, []);

  return (
    <Flex
      bg={bg}
      height="44px"
      padding="6px 12px"
      width="100%"
      position={"fixed"}
      zIndex={"999"}
      justify={{ md: "space-between" }}
    >
      <Flex
        align="center"
        width={{ base: "40px", md: "auto" }}
        mr={{ base: 0, md: 2 }}
        cursor="pointer"
        onClick={() => onSelectMenuItem(defaultMenuItem)}
      >
        {/* <Image src="/images/redditFace.svg" height="30px" />
        <Image
          src={
            colorMode === "light"
              ? "/images/redditText.svg"
              : "/images/Reddit-Word-Dark.svg"
          }
          height="46px"
          display={{ base: "none", md: "unset" }}
        /> */}
        <Image src="/images/redditlogo.png" height="50px" />
      </Flex>
      {user && <Directory />}
      <SearchInput user={user} />
      <RightContent user={user} />
    </Flex>
  );
};
export default Navbar;
