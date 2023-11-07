import { CreateGroup, UpdateImage, UpdateInFor } from "@/atoms/CommunitiesAtom";
import { getCookie } from "cookies-next";
import axiosClient from "../../ultils/axiosClient/index";
export const END_POINT = {
  GROUP_CREATE: "/group/create",
  GROUP_DATA: "/group",
  DELETE_GROUP: "/group/delete",
  UPDATE_GROUP: "/group/update",
  FIND_GROUP: "group/find-group",
  JOIN_GROUP: "/group/join-group",
  EXIT_GROUP: "/group/exit-group",
  KICK_USER: "group/kick-user",
  GET_ALL: "group/getAllGroup",
  GET_JOIN: "group/get-all-group",
  SUGGEST_GROUP: "group/suggest",
  GET_GROUP_POST: "group/groupPost",
  GET_TOTAL_MEMBER: "group/getNumberOfMembers",
  COUNT_GROUP: "group/count-group",
  MEMBER_GROUP: "group/getalluser",
};

export const createGroup = (payload: CreateGroup) => {
  return axiosClient.post(
    END_POINT.GROUP_CREATE,
    {
      description: payload.description,
      groupName: payload.groupName,
      timeCreate: new Date(),
      tags: payload.hashtag,
      categoryId: payload.category,
    },
    {
      headers: { Authorization: `Bearer ${getCookie("token")}` }, // Sử dụng "Bearer" trước token
    },
  );
};

export const updateImageGroup = (payload: UpdateImage, groupID: string) => {
  return axiosClient.put(
    END_POINT.UPDATE_GROUP + "/" + groupID,
    {
      imageURLGAvatar: payload.imageURLGAvatar,
      imageUrlGCover: payload.imageUrlGCover,
    },
    {
      headers: { Authorization: `${getCookie("token")}` },
    },
  );
};

export const updateInfoGroup = (payload: UpdateInFor, groupID: string) => {
  return axiosClient.put(
    END_POINT.UPDATE_GROUP + "/" + groupID,
    {
      description: payload.description,
    },
    {
      headers: { Authorization: `Bearer ${getCookie("token")}` }, // Sử dụng "Bearer" trước token
    },
  );
};

export const getGroupJoin = (userId: number) => {
  return axiosClient.get(END_POINT.GET_JOIN + "/" + userId, {});
};

export const countGroup = (userId: number) => {
  return axiosClient.get(END_POINT.COUNT_GROUP + "/" + userId, {});
};

export const getGroupData = (groupID: string) => {
  return axiosClient.get(END_POINT.GROUP_DATA + "/" + groupID, {});
};

export const getGroupMember = (groupID: number) => {
  return axiosClient.get(END_POINT.MEMBER_GROUP + "/" + groupID, {});
};

export const getAllGroup = () => {
  return axiosClient.get(END_POINT.GET_ALL, {});
};

export const getGroupPost = (groupId: number) => {
  return axiosClient.get(END_POINT.GET_GROUP_POST + "/" + groupId, {});
};

export const getTotalMember = (groupId: number) => {
  return axiosClient.get(END_POINT.GET_TOTAL_MEMBER + "/" + groupId, {});
};

export const getSuggest = () => {
  return axiosClient.post(
    END_POINT.SUGGEST_GROUP,
    {},
    {
      headers: { Authorization: `Bearer ${getCookie("token")}` }, // Sử dụng "Bearer" trước token
    },
  );
};

export const deleteGroup = (groupID: string) => {
  return axiosClient.post(
    END_POINT.DELETE_GROUP + "/" + groupID,
    {},
    {
      headers: { Authorization: `Bearer ${getCookie("token")}` }, // Sử dụng "Bearer" trước token
    },
  );
};
export const joinGroup = (groupID: number) => {
  return axiosClient.post(
    END_POINT.JOIN_GROUP + "/" + groupID,
    {},
    {
      headers: { Authorization: `Bearer ${getCookie("token")}` }, // Sử dụng "Bearer" trước token
    },
  );
};

export const findGroup = (content: string) => {
  return axiosClient.post(
    END_POINT.FIND_GROUP,
    {
      findContent: content,
    },
    {
      headers: { Authorization: `Bearer ${getCookie("token")}` }, // Sử dụng "Bearer" trước token
    },
  );
};

export const exitGroup = (groupID: number) => {
  return axiosClient.post(
    END_POINT.EXIT_GROUP + "/" + groupID,
    {},
    {
      headers: { Authorization: `Bearer ${getCookie("token")}` }, // Sử dụng "Bearer" trước token
    },
  );
};

export const kickMember = (groupID: number, userKick: string) => {
  return axiosClient.post(
    END_POINT.KICK_USER + "/" + groupID + "?userName=" + userKick,
    {},
    {
      headers: { Authorization: `Bearer ${getCookie("token")}` }, // Sử dụng "Bearer" trước token
    },
  );
};
