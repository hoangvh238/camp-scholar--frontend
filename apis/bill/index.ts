import { getCookie } from "cookies-next";
import axiosClient from "../../ultils/axiosClient/index";

export const END_POINT = {
  GET_BILL: "/payment-history/get-payment-history",
  GET_EXCHANGE: "/exchange-request/status-request",
};

export const getAllBill = (userId: number) => {
  return axiosClient.get(END_POINT.GET_BILL + "/" + userId, {
    headers: { Authorization: `Bearer ${getCookie("token")}` }, // Sử dụng "Bearer" trước token
  });
};

export const getAllExchange = () => {
  return axiosClient.get(END_POINT.GET_EXCHANGE, {
    headers: { Authorization: `Bearer ${getCookie("token")}` }, // Sử dụng "Bearer" trước token
  });
};
