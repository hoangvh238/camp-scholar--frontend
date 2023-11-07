import { getCookie } from "cookies-next";
import axiosClient from "../../ultils/axiosClient/index";

export const END_POINT = {
  GET_USER: "/myProfile",
  DELETEPOST: "/api/poster/deletepost/{postId}",
  EDITPOST: "/api/poster/editpost",
  POSTING: "/api/poster/posting",
  EDIT_PIC: "/myProfile/edit-avatar",
  GET_COINT: "/myProfile/getCoint",
  GET_POINT: "/myProfile/getPoint",
};

export const getUserData = (payload: string) => {
  return axiosClient.post(
    END_POINT.GET_USER + "/" + payload,
    {},
    {
      headers: { Authorization: `Bearer ${getCookie("token")}` }, // Sử dụng "Bearer" trước token
    },
  );
};

export const updateImageUser = (avatar: string, cover: string) => {
  return axiosClient.post(
    END_POINT.EDIT_PIC,
    {
      avatarURL: avatar,
      backgroundURL: cover,
    },
    {
      headers: { Authorization: `Bearer ${getCookie("token")}` }, // Sử dụng "Bearer" trước token
    },
  );
};

export const updateImageUserPhone = (
  avatar: string,
  cover: string,
  phone: string,
) => {
  return axiosClient.post(
    END_POINT.EDIT_PIC,
    {
      avatarURL: avatar,
      backgroundURL: cover,
    },
    {
      headers: { Authorization: `Bearer ${getCookie("token")}` }, // Sử dụng "Bearer" trước token
    },
  );
};

export const getCoint = () => {
  return axiosClient.post(
    END_POINT.GET_COINT,
    {},
    {
      headers: { Authorization: `Bearer ${getCookie("token")}` }, // Sử dụng "Bearer" trước token
    },
  );
};

export const getPoint = () => {
  return axiosClient.post(
    END_POINT.GET_POINT,
    {},
    {
      headers: { Authorization: `Bearer ${getCookie("token")}` }, // Sử dụng "Bearer" trước token
    },
  );
};
