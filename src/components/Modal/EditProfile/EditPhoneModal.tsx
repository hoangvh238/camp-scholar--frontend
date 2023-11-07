import { User } from "@/atoms/userAtom";
import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { message } from "antd";
import {
  ConfirmationResult,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import React, { useState } from "react";
import { BsFillShieldLockFill, BsTelephoneFill } from "react-icons/bs";
import { CgSpinner } from "react-icons/cg";
import OtpInput from "react-otp-input";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { updatePhone } from "../../../../apis/user";
import { auth } from "../../../firebase/clientApp";

type EditPhone = {
  open: boolean;
  handClose: () => void;
  user: User;
};

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
    confirmationResult: ConfirmationResult;
  }
}

const EditPhoneModal: React.FC<EditPhone> = ({ open, handClose, user }) => {
  const [loading, setLoading] = useState(false);

  const [userData, setUserData] = useState<any>();
  const [otp, setOtp] = useState("");
  const [ph, setPh] = useState("");
  const [showOTP, setShowOTP] = useState(false);

  const handleUpdate = async (phone: string) => {
    try {
      await updatePhone(phone);
      message.success("Cập nhật số điện thoại thành công !");
      window.location.reload();
    } catch (error) {
      message.error("Cập nhật số điện thoại thất bại !");
      console.log(error);
    }
  };
  function onCaptchVerify() {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response: any) => {
            onSignup();
          },
          "expired-callback": () => {},
        },
        auth,
      );
    }
  }

  function onSignup() {
    setLoading(true);
    onCaptchVerify();

    const appVerifier = window.recaptchaVerifier;

    const formatPh = "+" + ph;

    signInWithPhoneNumber(auth, formatPh, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        message.success("Gửi OTP thành công !");
        setLoading(false);
        setShowOTP(true);
      })
      .catch((error) => {
        console.log(error);
        message.error("Gửi OTP thất bại !");
        setLoading(false);
      });
  }

  function onOTPVerify() {
    setLoading(true);
    window.confirmationResult
      .confirm(otp)
      .then(async (res) => {
        if (res.user.phoneNumber != null) handleUpdate(res.user.phoneNumber);
        setUserData(res.user);
        message.success("Xác thực số điện thoại thành công !");
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        message.error("Xác thực số điện thoại thất bại !");
        setLoading(false);
      });
  }

  return (
    <>
      <Modal isOpen={open} onClose={handClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            display="flex"
            flexDirection="column"
            fontSize={15}
            padding={3}
          >
            Xác minh số điện thoại
          </ModalHeader>

          <Box pl={3} pr={3}>
            <ModalCloseButton />
            <ModalBody
              display="flex"
              textColor={"black"}
              flexDirection="column"
              padding="10px 0px"
            >
              <div className="flex justify-center content-center">
                <div id="recaptcha-container"></div>
                {userData ? (
                  <h2 className="text-center font-medium text-2xl">
                    👍Xác minh thành công
                  </h2>
                ) : (
                  <div className="w-80 flex flex-col gap-4 rounded-lg p-4">
                    {showOTP ? (
                      <>
                        <div className="w-fit mx-auto p-4 rounded-full">
                          <BsFillShieldLockFill size={30} />
                        </div>
                        <label
                          htmlFor="otp"
                          className="font-bold text-xl text-center"
                        >
                          Nhập OTP từ tin nhắn
                        </label>
                        <div className="w-full flex justify-center">
                          <OtpInput
                            value={otp}
                            onChange={setOtp}
                            numInputs={6}
                            renderSeparator={<span className="mx-2"></span>}
                            inputStyle={{
                              border: "2px solid", // Thay #yourBorderColor bằng màu sắc bạn muốn
                              width: "40px",
                              height: "40px", // Thay yourWidth bằng chiều rộng bạn muốn, ví dụ: "100px"
                            }}
                            shouldAutoFocus
                            renderInput={(props) => <input {...props} />}
                          />
                        </div>
                        <Button
                          onClick={onOTPVerify}
                          className=" w-full flex gap-1 items-center justify-center py-2.5  rounded"
                        >
                          {loading && (
                            <CgSpinner
                              size={20}
                              className="mt-1 animate-spin"
                            />
                          )}
                          <span>Xác minh OTP</span>
                        </Button>
                      </>
                    ) : (
                      <>
                        <div className="bg-white text-emerald-500 w-fit mx-auto p-4 rounded-full">
                          <BsTelephoneFill size={30} />
                        </div>
                        <Text className="font-bold text-xl text-center">
                          Xác thực số điện thoại
                        </Text>
                        <PhoneInput
                          placeholder="Nhập số điện thoại..."
                          country={"vn"}
                          value={ph}
                          onChange={setPh}
                        />
                        <Button
                          onClick={onSignup}
                          className="bg-emerald-600 w-full flex gap-1 items-center justify-center py-2.5 text-white rounded"
                        >
                          {loading && (
                            <CgSpinner
                              size={20}
                              className="mt-1 animate-spin"
                            />
                          )}
                          <span>Gửi mã qua SMS</span>
                        </Button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </ModalBody>
          </Box>
        </ModalContent>
      </Modal>
    </>
  );
};
export default EditPhoneModal;
