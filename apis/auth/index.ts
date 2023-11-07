import { getCookie } from "cookies-next";
import axiosClient from "../../ultils/axiosClient/index";

export const END_POINT = {
  LOGIN: "/auth/sign-in",
  REGISTER: "/auth/sign-up",
  GETOTP: "/forgot/a",
  VERIFY: "/forgot/verify-key",
  CHANGE: "/forgot/verifykey/",
  GOOGLE: "/auth/v1/login",
  MAIL_SENDER: "/auth/verify-email-reset",
  RESET_TOKEN: "auth/refreshToken",
};

type UserLogin = {
  userName: string;
  password: string;
};

type GetOTP = {
  email: string;
};

type CheckOTP = {
  otp: string;
  email: string;
};

type ChangePassword = {
  password: string;
  token: string;
};

type LoginResponse = {
  data: {
    token: string;
  };
};

type UserRegister = {
  email: string;
  password: string;
  userName: string;
};

export const loginAccount = (payload: UserLogin) => {
  return axiosClient.post<LoginResponse>(END_POINT.LOGIN, {
    userName: payload.userName,
    password: payload.password,
  });
};
export const registerAccount = (payload: UserRegister) => {
  return axiosClient.post(END_POINT.REGISTER, {
    email: payload.email,
    password: payload.password,
    userName: payload.userName,
  });
};

export const getOTP = (payload: GetOTP) => {
  return axiosClient.get(END_POINT.GETOTP + "?email=" + payload.email, {});
};

export const mailSender = (payload: GetOTP) => {
  return axiosClient.get(END_POINT.MAIL_SENDER + "?email=" + payload.email, {});
};

export const checkOTP = (payload: CheckOTP) => {
  return axiosClient.get(
    END_POINT.VERIFY + "?otp=" + payload.otp + "&email=" + payload.email,
    {},
  );
};

export const changePassword = (payload: ChangePassword) => {
  return axiosClient.get(
    END_POINT.CHANGE + payload.token + "?password=" + payload.password,
    {},
  );
};

export const loginWithGG = (payload: UserRegister) => {
  return axiosClient.post(END_POINT.GOOGLE, {
    email: payload.email,
    password: payload.password,
    userName: payload.userName,
  });
};

export const resetToken = () => {
  return axiosClient.get(END_POINT.RESET_TOKEN, {
    headers: { Authorization: `Bearer ${getCookie("token")}` }, // Sử dụng "Bearer" trước token
  });
};
