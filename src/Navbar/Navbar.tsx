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
import { getUser } from "@/hooks/userStorage";
import { getCookie } from "cookies-next";
import { useDispatch } from "react-redux";
import { store } from "@/redux/slices/userInfor";

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
  role: string,
};

const Navbar: React.FC = () => {
  const [userCreates, setUserCreate] = useState<boolean>(false);
  const { onSelectMenuItem } = useDirectory();
  const { colorMode } = useColorMode();
  const bg = useColorModeValue("white", "#232020");
  const dispatch = useDispatch();
  const [user,setUser] = useState<UserBase>();

  const storage = async () => {
    const token =  getCookie("token");

    if (!token) return null;

    var decoded: UserBase = jwt_decode(token);
    const user = {
      userName: decoded!.userName,
      role: decoded!.role,
    };
    
    setUser(user);
    dispatch(
      store({
        user
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
        <Image src="/images/redditFace.svg" height="30px" />
        <Image
          src={
            colorMode === "light"
              ? "/images/redditText.svg"
              : "/images/Reddit-Word-Dark.svg"
          }
          height="46px"
          display={{ base: "none", md: "unset" }}
        />
      </Flex>
      {user && <Directory />}
      <SearchInput user={user} />
      <RightContent user={user} />
    </Flex>
  );
};
export default Navbar;
