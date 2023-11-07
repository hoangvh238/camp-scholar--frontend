import { Button, Flex, Icon, Input, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { BsDot } from "react-icons/bs";
import { GrPowerReset } from "react-icons/gr";
import { HiOutlineMail } from "react-icons/hi";
import { useSetRecoilState } from "recoil";
import { mailSender } from "../../../../apis/auth";
import { authModelState } from "../../../atoms/authModalAtom";
type GetOTP = {
  email: string;
};
/*
type ResetPasswordProps = {
    toggleView: (view: ModalView) => void;
};
*/

const ResetPassword: React.FC = () => {
  const setAuthModalState = useSetRecoilState(authModelState);
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setIsloading] = useState(false);
  const router = useRouter();

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsloading(true);
    const value: GetOTP = {
      email: email,
    };
    try {
      const res = await mailSender(value);
      setSuccess(true);
    } catch (error) {}
    setIsloading(false);
  };

  return (
    <Flex direction="column" alignItems="center" width="100%">
      <Icon as={GrPowerReset} color="brand.100" fontSize={40} mb={2} />
      <Text fontWeight={700} mb={2}>
        Khôi phục mật khẩu
      </Text>
      {success ? (
        <>
          <Text className="text-green">Kiểm tra email của bạn ngay</Text>
          <Text>👇</Text>
          <HiOutlineMail
            className="h-10 w-10 mb-8 animate-ping"
            onClick={() => {
              router.replace("https://www.google.com/mail");
            }}
          ></HiOutlineMail>
        </>
      ) : (
        <>
          <Text fontSize="sm" textAlign="center" mb={2}>
            Nhập email và tôi sẽ gửi đường dẫn khôi phục mật khẩu trong email
            bạn
          </Text>
          <form onSubmit={onSubmit} style={{ width: "100%" }}>
            <Input
              required
              name="email"
              placeholder="Email..."
              type="email"
              mb={2}
              onChange={(event) => setEmail(event.target.value)}
              fontSize="10pt"
              _placeholder={{ color: "gray.500" }}
              _hover={{
                bg: "white",
                border: "1px solid",
                borderColor: "blue.500",
              }}
              _focus={{
                outline: "none",
                bg: "white",
                border: "1px solid",
                borderColor: "blue.500",
              }}
              bg="gray.50"
            />

            <Button
              width="100%"
              height="36px"
              mb={2}
              mt={2}
              type="submit"
              isLoading={loading}
            >
              Gửi
            </Button>
          </form>
        </>
      )}
      <Flex
        alignItems="center"
        fontSize="9pt"
        color="blue.500"
        fontWeight={700}
        cursor="pointer"
      >
        <Text
          onClick={() =>
            setAuthModalState((prev) => ({
              ...prev,
              view: "login",
            }))
          }
        >
          LOGIN
        </Text>
        <Icon as={BsDot} />
        <Text
          onClick={() =>
            setAuthModalState((prev) => ({
              ...prev,
              view: "signup",
            }))
          }
        >
          SIGN UP
        </Text>
      </Flex>
    </Flex>
  );
};
export default ResetPassword;
