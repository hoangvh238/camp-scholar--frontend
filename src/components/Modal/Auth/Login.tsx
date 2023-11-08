import { Button, Flex, Input, Text, useColorModeValue } from "@chakra-ui/react";
import React, { useState } from "react";
import { useSetRecoilState } from "recoil";

import { login } from "@/redux/slices/userInfor";
import { message } from "antd";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { useDispatch } from "react-redux";
import { ValidationError } from "yup";
import { loginAccount } from "../../../../apis/auth";
import { authModelState } from "../../../atoms/authModalAtom";

type UserLogin = {
  userName: string;
  password: string;
};

type EncodeType = {
  userName: string;
  role: string;
};
type LoginProps = {};

const Login: React.FC<LoginProps> = () => {
  const setAuthModelState = useSetRecoilState(authModelState);
  const [isLoading, setIsLoading] = useState(false);
  const [loginForm, setLoginForm] = useState<UserLogin>({
    userName: "",
    password: "",
  });
  const searchBorder = useColorModeValue("blue.500", "#4A5568");
  const inputBg = useColorModeValue("gray.50", "#4A5568");
  const focusedInputBg = useColorModeValue("white", "#2D3748");
  const placeholderColor = useColorModeValue("gray.500", "#CBD5E0");
  const dispatch = useDispatch();

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const loginResponse = await loginAccount(loginForm);

      const token = loginResponse.data;
      const tokenString = token.data.token;
      var decoded: EncodeType = jwt_decode(tokenString);

      const userBase = {
        userName: decoded!.userName,
        role: decoded!.role,
      };
      console.log();

      dispatch(
        login({
          tokenString,
          userBase,
        }),
      );

      message.success("Login success !");

      setTimeout(() => {
        window.location.reload();
      }, 700);
    } catch (error: unknown) {
      if (error instanceof ValidationError) {
        if (error?.name === "ValidationError") {
          message.error("Không thể đăng nhập");
        }
      }
      if (axios.isAxiosError(error)) {
        if (
          error.response?.status === 401 ||
          error.response?.status === 404 ||
          error.response?.status === 500
        ) {
          message.error("Sai mật khẩu hoặc tên đăng nhập");
        }
        if (error.response?.status === 403) {
          message.warning(
            "Tài khoản đã bị khóa, liên hệ admin để được giải quyết",
          );
        }
      }
      setIsLoading(false);
      //export type TypeOptions = 'info' | 'success' | 'warning' | 'error' | 'default';
    }
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // update state
    setLoginForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  return (
    <form onSubmit={onSubmit}>
      <Input
        required
        name="userName"
        placeholder="Tên đăng nhập..."
        type="userName"
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
      <Text textAlign="center" color="red" fontSize="10pt"></Text>
      <Button
        width="100%"
        height="36px"
        mt={2}
        mb={2}
        type="submit"
        isLoading={isLoading}
      >
        Đăng nhập
      </Button>
      <Flex justifyContent="center" mb={2}>
        <Text fontSize="9pt" mr={1}>
          Quên mật khẩu ?
        </Text>
        <Text
          fontSize="9pt"
          color="blue.500"
          cursor="pointer"
          onClick={() =>
            setAuthModelState((prev) => ({
              ...prev,
              view: "resetPassword",
            }))
          }
        >
          Khôi phục
        </Text>
      </Flex>
      <Flex fontSize="9pt" justifyContent="center">
        <Text mr={1}>Tạo mới ?</Text>
        <Text
          color="blue.500"
          fontWeight={700}
          cursor="pointer"
          onClick={() =>
            setAuthModelState((prev) => ({
              ...prev,
              view: "signup",
            }))
          }
        >
          Đăng ký
        </Text>
      </Flex>
    </form>
  );
};
export default Login;
