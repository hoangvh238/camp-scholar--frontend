import {
  Button,
  Divider,
  Input,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { message } from "antd";
import { motion } from "framer-motion";
import jwt_decode from "jwt-decode";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { changePassword } from "../../../apis/auth";

export default function Page() {
  const router = useRouter();
  const token = router.query.token?.toString();
  const [email, setEmail] = useState("");

  type ChangePassword = {
    password: string;
    token: string;
  };

  type TokenForgot = {
    email: string;
  };

  const [signUpForm, setSignUpForm] = useState({
    password: "",
    conformPassword: "",
  });
  const [error, setError] = useState("");
  const searchBorder = useColorModeValue("blue.500", "#4A5568");
  const inputBg = useColorModeValue("gray.50", "#4A5568");
  const focusedInputBg = useColorModeValue("white", "#2D3748");
  const placeholderColor = useColorModeValue("gray.500", "#CBD5E0");

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token) return;
    if (error) setError("");
    if (signUpForm.password !== signUpForm.conformPassword) {
      setError("Password Do Not Match");
      message.warning("Mật khẩu không khớp");

      return;
    }

    const data: ChangePassword = {
      token: token,
      password: signUpForm.password,
    };
    try {
      await changePassword(data);
      message.success("Đổi thành công!");
      router.push("/");
    } catch (error) {
      message.error("Đổi thất bại");
    }
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // update state
    setSignUpForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  useEffect(() => {
    if (!token) return;
    var decoded: TokenForgot = jwt_decode(token);
    setEmail(decoded?.email);
  }, [token]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <Head>
        <title>Camp Scholar</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/images/header.png" />
      </Head>

      <div className="w-full h-screen flex justify-center content-center">
        <div
          className="relative top-10  bg-white px-4 py-4 "
          style={{ width: "30%", height: "280px", borderRadius: "15px" }}
        >
          <Text className="text-center font-bold font-[15px] ">
            Đổi mật khẩu
          </Text>
          <Divider></Divider>
          <form onSubmit={onSubmit}>
            <Input
              disabled
              name="email"
              placeholder="Email..."
              type="email"
              value={email}
              mb={2}
              onChange={onChange}
              fontSize="10pt"
              _placeholder={{ color: placeholderColor }}
              _hover={{
                bg: focusedInputBg,
                border: "1px solid",
                borderColor: searchBorder,
              }}
              _focus={{
                outline: "none",
                bg: focusedInputBg,
                border: "1px solid",
                borderColor: searchBorder,
              }}
              bg={inputBg}
            />
            <Input
              required
              name="password"
              placeholder="Mật khẩu..."
              type="password"
              mb={2}
              onChange={onChange}
              fontSize="10pt"
              _placeholder={{ color: placeholderColor }}
              _hover={{
                bg: focusedInputBg,
                border: "1px solid",
                borderColor: "blue.500",
              }}
              _focus={{
                outline: "none",
                bg: focusedInputBg,
                border: "1px solid",
                borderColor: searchBorder,
              }}
              bg={inputBg}
            />

            <Input
              required
              name="conformPassword"
              placeholder="Nhập lại mật khẩu..."
              type="password"
              mb={2}
              onChange={onChange}
              fontSize="10pt"
              _placeholder={{ color: placeholderColor }}
              _hover={{
                bg: focusedInputBg,
                border: "1px solid",
                borderColor: "blue.500",
              }}
              _focus={{
                outline: "none",
                bg: focusedInputBg,
                border: "1px solid",
                borderColor: searchBorder,
              }}
              bg={inputBg}
            />

            <Button
              width="100%"
              height="36px"
              mt={2}
              mb={2}
              type="submit"
              isLoading={false}
            >
              Thay đổi
            </Button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
