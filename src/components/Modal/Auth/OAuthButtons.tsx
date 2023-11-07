import { Button, Flex, Image, Text, useColorModeValue } from "@chakra-ui/react";
import { User } from "firebase/auth";
import { collection, doc, setDoc } from "firebase/firestore";
import React, { useEffect } from "react";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { auth, firestore } from "../../../firebase/clientApp";
import { loginWithGG } from "../../../../apis/auth";
import { message } from "antd";
import { setCookie } from "cookies-next";
import OAuthButtonsFacebook from "./OauthButtonFacebook";

type UserRegister = { 
  email : string, 
  password : string,
  userName: string
};

const OAuthButtons: React.FC = () => {
  const [signInWithGoogle, userCred, loading, error] =
    useSignInWithGoogle(auth);

  
  const hoverBg = useColorModeValue("gray.50", "#2A4365");

  const createUserDocument = async (user: User) => {
    const userDocRef = doc(firestore, "users", user.uid);
  
    try {
      const response = await setDoc(userDocRef, JSON.parse(JSON.stringify(user)));
      console.log("Document creation response:", response);
      const email = auth.currentUser?.email;
      const id = auth.currentUser?.uid;
      if(!email || !id)
      {
         message.error("Không thể đăng nhập");
         return;
      }
      const parts = email.split("@");
      
      const payload:UserRegister = {
        userName : parts[0],
        email : email,
        password : id
      }
      try
      {
        const resLogin = await loginWithGG(payload);
        setCookie("token",resLogin.data.data.token);
        message.success("Đăng nhập thành công");
        window.location.reload();
      }
      catch(error)
      {
          message.error("Đăng nhập thất bại");
          console.log(error);
          
      }
      
      
      
    } catch (error) {
      message.error("Đăng nhập thất bại");
    }
  };

  useEffect(() => {
    if (userCred) {
      createUserDocument(userCred.user);
    }
  }, [userCred]);

  return (
    <Flex direction="column" width="100%" mb={4}>
      <Button
        variant="oauth"
        _hover={{ bg: hoverBg }}
        mb={2}
        isLoading={loading}
        onClick={() => signInWithGoogle()}
      >
        <Image src="/images/googlelogo.png" height="20px" mr={4} />
        Tiếp tục với Google
      </Button>
        <OAuthButtonsFacebook></OAuthButtonsFacebook>
    </Flex>
  );
};
export default OAuthButtons;
