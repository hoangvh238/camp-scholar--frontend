import React from "react";

import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { message } from "antd";
import axios from "axios";
import { getCookie } from "cookies-next";

type PaypalBtn = {
  dolar: number;
  userId: number;
};

const PaypalBtn: React.FC<PaypalBtn> = ({ dolar, userId }) => {
  return (
    <>
      <PayPalScriptProvider
        options={{
          clientId:
            "AdaiaDzDPyBEbZW7PS9w2joYQkPNabn9o-86KZDcV8JP0nWj2ieLb7f0BtbW3A1ZhcTn4RoAz1ZybBtZ&currency=USD",
        }}
      >
        <PayPalButtons
          createOrder={async () => {
            const formData = new FormData();
            formData.append("total", `${dolar}`);
            formData.append("userId", `${userId}`);
            try {
              const response = await axios.post(
                " http://localhost:8080/api/orders",
                formData,
                {
                  headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${getCookie("token")}`,
                  },
                },
              );

              return response.data.id;
            } catch (error) {
              message.error("Lỗi khi thanh toán.");
              console.error(error);
            }
          }}
          onApprove={async (data, actions) => {
            return fetch(
              `http://localhost:8080/api/orders/${data.orderID}/capture`,
              {
                method: "post",
              },
            )
              .then((response) => response.json())
              .then((orderData) => {
                // Successful capture! For dev/demo purposes:
                console.log(
                  "Capture result",
                  orderData,
                  JSON.stringify(orderData, null, 2),
                );
                const transaction =
                  orderData.purchase_units[0].payments.captures[0];
                message.success(
                  "Thanh toán thành công, mã hóa đơn : " + transaction.id,
                );
              });
          }}
          onCancel={(data) => console.log("tui out")}
          style={{ layout: "horizontal", color: "blue" }}
        />
      </PayPalScriptProvider>
    </>
  );
};
export default PaypalBtn;
