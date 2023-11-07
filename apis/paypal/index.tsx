import { getCookie } from "cookies-next";
import axiosClient from "../../ultils/axiosClient/index";

export const END_POINT = {
  PAYPAL_HOME: "/paypal/home",
  PAYPAL_CREATE: "/paypal/payment/create",
  PAYPAL_SUCCESS: "/paypal/payment/success",
  PAYPAL_CANCEL: "/paypal/payment/cancel",
  PAYPAL_ERROR: "/paypal/payment/error",
  CREATE_PAYPAL: "/api/orders",
  EXCHANGE: "/exchange-request/make-request",
};

export const renderHomePayment = () => {
  return axiosClient.post(
    END_POINT.PAYPAL_HOME,
    {},
    {
      headers: { Authorization: `Bearer ${getCookie("token")}` },
    },
  );
};
const data = {
  total: 20,
  userId: 1,
};

export const exchangeMoney = (amountCoins: number, totalMoney: number) => {
  return axiosClient.post(
    END_POINT.EXCHANGE,
    {
      time: new Date(),
      amountCoins: amountCoins,
      totalMoney: totalMoney,
    },
    {
      headers: { Authorization: `Bearer ${getCookie("token")}` },
    },
  );
};

//   export const createPaypal = () => {
//     const token = getCookie("token");
//     const headers = { Authorization: `Bearer ${token}` };
//     const data = { "method":"paypal", "amount":"20", "currency":"USD", "description":"description" };

//     return axiosClient.post(END_POINT.PAYPAL_CREATE, data, { headers });
// };

export const createPAYPAL = () => {
  return axiosClient.post(END_POINT.CREATE_PAYPAL, data, {
    headers: { Authorization: `Bearer ${getCookie("token")}` },
  });
};
