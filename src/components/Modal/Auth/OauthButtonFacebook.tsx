import { Button, Image, Text, useColorModeValue } from "@chakra-ui/react";
import { message } from "antd";
import { setCookie } from "cookies-next";
import { User } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import React, { useEffect } from "react";
import { useSignInWithFacebook } from "react-firebase-hooks/auth";
import { loginWithGG } from "../../../../apis/auth";
import { auth, firestore } from "../../../firebase/clientApp";

type UserRegister = {
  email: string;
  password: string;
  userName: string;
};

const OAuthButtonsFacebook: React.FC = () => {
  const [signInWithFacebook, userCred, loading, error] =
    useSignInWithFacebook(auth);

  const hoverBg = useColorModeValue("gray.50", "#2A4365");

  const createUserDocument = async (user: User) => {
    const userDocRef = doc(firestore, "users", user.uid);

    try {
      const response = await setDoc(
        userDocRef,
        JSON.parse(JSON.stringify(user)),
      );
      console.log("Document creation response:", response);
      const email = auth.currentUser?.email;
      const id = auth.currentUser?.uid;
      if (!email || !id) {
        message.error("Không thể đăng nhập");
        return;
      }
      const parts = email.split("@");

      const payload: UserRegister = {
        userName: parts[0],
        email: email,
        password: id,
      };
      try {
        const resLogin = await loginWithGG(payload);
        setCookie("token", resLogin.data.data.token);
        message.success("Đăng nhập thành công");
        window.location.reload();
      } catch (error) {
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
    <>
      <Button
        variant="oauth"
        _hover={{ bg: hoverBg }}
        mb={2}
        isLoading={loading}
        onClick={() => signInWithFacebook()}
      >
        <Image src="/images/facebook.png" height="20px" mr={4} />
        tiếp tục với Facebook
      </Button>
      {error && <Text>{error.message}</Text>}
    </>
  );
};
export default OAuthButtonsFacebook;
