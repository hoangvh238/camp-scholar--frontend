import { getCookie } from "cookies-next";
import axiosClient from "../../ultils/axiosClient/index";

export const END_POINT = {
  POST_DOC: "/doc/document",
  GET_ALL: "/doc/documents",
  GROUP_ALL: "/doc/group-documents",
  USER_BUY_LIST: "/doc/bought-documents",
  USER_PAY: "/doc/buy",
  USER_REVIEW: "/doc/preview",
  DOWN_DOC: "/doc/download",
  DOC_STATUS: "doc/my-documents",
  DOC_COVER: "/doc/preview/cover",
  DOC_RATE: "/doc/rate",
  HOST_DOC: "/doc/host",
  HOST_REJECT: "/doc/rejected",
  HOST_ACCEPT: "/doc/accept",
};

export const getAllDOCByGroup = (groupID: number) => {
  return axiosClient.post(
    END_POINT.GROUP_ALL + "/" + groupID,
    {},
    {
      headers: { Authorization: `Bearer ${getCookie("token")}` }, // Sử dụng "Bearer" trước token
    },
  );
};

export const getAllHOSTDOCByGroup = (groupID: number) => {
  return axiosClient.get(END_POINT.HOST_DOC + "/" + groupID, {
    headers: { Authorization: `Bearer ${getCookie("token")}` }, // Sử dụng "Bearer" trước token
  });
};

export const rejectDocument = (docId: number, message: string) => {
  return axiosClient.put(
    END_POINT.HOST_REJECT + "/" + docId + "?message=" + message,
    {},
    {
      headers: { Authorization: `Bearer ${getCookie("token")}` }, // Sử dụng "Bearer" trước token
    },
  );
};

export const acceptDocument = (docId: number) => {
  return axiosClient.put(
    END_POINT.HOST_ACCEPT + "/" + docId,
    {},
    {
      headers: { Authorization: `Bearer ${getCookie("token")}` }, // Sử dụng "Bearer" trước token
    },
  );
};

export const getAllStatusDocUpload = () => {
  return axiosClient.get(END_POINT.DOC_STATUS, {
    headers: { Authorization: `Bearer ${getCookie("token")}` }, // Sử dụng "Bearer" trước token
  });
};

export const getCoverDoc = (postId: number) => {
  return axiosClient.get(END_POINT.DOC_COVER + "/" + postId, {
    headers: { Authorization: `Bearer ${getCookie("token")}` }, // Sử dụng "Bearer" trước token
  });
};

export const buyDoc = (docId: number) => {
  return axiosClient.post(
    END_POINT.USER_PAY + "/" + docId,
    {},
    {
      headers: { Authorization: `Bearer ${getCookie("token")}` }, // Sử dụng "Bearer" trước token
    },
  );
};

export const getAllBoughtDocument = () => {
  return axiosClient.post(
    END_POINT.USER_BUY_LIST,
    {},
    {
      headers: { Authorization: `Bearer ${getCookie("token")}` }, // Sử dụng "Bearer" trước token
    },
  );
};

export const ratingDoc = (docId: number, start: number) => {
  return axiosClient.post(
    END_POINT.DOC_RATE + "/" + docId + "?stars=" + start,
    {},
    {
      headers: { Authorization: `Bearer ${getCookie("token")}` }, // Sử dụng "Bearer" trước token
    },
  );
};
