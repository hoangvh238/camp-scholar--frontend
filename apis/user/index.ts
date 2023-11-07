import { getCookie } from "cookies-next";
import axiosClient from "../../ultils/axiosClient/index";

export const END_POINT = {
  GET_USER: "/myProfile",
  DELETEPOST: "/api/poster/deletepost/{postId}",
  EDITPOST: "/api/poster/editpost",
  POSTING: "/api/poster/posting",
  UPDATE_PHONE: "/myProfile/edit-phone",
  STATIC_DATA: "/myProfile/get-sale-report",
};

export const getUser = (payload: string) => {
  return axiosClient.get(END_POINT.GET_USER + "/" + payload, {});
};

export const updatePhone = (payload: string) => {
  return axiosClient.put(
    END_POINT.UPDATE_PHONE + "?phone=" + payload,
    {},
    {
      headers: { Authorization: `Bearer ${getCookie("token")}` },
    },
  );
};

export const getStaticData = () => {
  return axiosClient.get(END_POINT.STATIC_DATA, {
    headers: { Authorization: `Bearer ${getCookie("token")}` }, // Sử dụng "Bearer" trước token
  });
};
