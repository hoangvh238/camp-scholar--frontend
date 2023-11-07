import { getCookie } from "cookies-next";
import axiosClient from "../../ultils/axiosClient/index";

export const END_POINT = {
  GET_ALL_POST: "/api/poster/getPosts",
  DELETE_POST: "/api/poster/deletepost",
  EDIT_POST: "/api/poster/editpost",
  POSTING: "/api/poster/posting",
  LIKE: "api/poster/like",
  DIS_LIKE: "api/poster/dislike",
  POST_REPORT: "api/poster/report",
  FIND_POST: "api/poster/find-post",
  DONATE_POST: "api/poster/donate",
  GROUP_POST: "api/poster/getPosts",
  POST_LIKE: "api/poster/getPostDTObylike",
  POST_COMMENT: "api/poster/getPostDTObycomment",
  POST_TIME: "api/poster/getPostDTObytime",
  POST_CURRENT: "/api/poster/getPost",
  POST_REPORT_TYPE: "/api/poster/all-report-types",
  POST_SAVE: "/api/poster/save",
  POST_SAVE_ALL: "/api/poster/save/getAll",
};

type Posting = {
  content: string;
  time: Date;
  userId: number;
  groupId: number;
  titles: string;
};

export const getAllPost = () => {
  return axiosClient.get(END_POINT.GET_ALL_POST, {});
};

export const getAllReportType = () => {
  return axiosClient.get(END_POINT.POST_REPORT_TYPE, {});
};

export const getCurrentPost = (postId: number) => {
  return axiosClient.get(END_POINT.POST_CURRENT + "/" + postId, {
    headers: { Authorization: `Bearer ${getCookie("token")}` }, // Sử dụng "Bearer" trước token
  });
};

export const getPostByComment = () => {
  return axiosClient.get(END_POINT.POST_COMMENT, {});
};

export const getPostByLike = () => {
  return axiosClient.get(END_POINT.POST_LIKE, {});
};

export const getPostByTime = () => {
  return axiosClient.get(END_POINT.POST_TIME, {});
};

export const savePost = (postId: number) => {
  return axiosClient.post(
    END_POINT.POST_SAVE + "/" + postId,
    {},
    {
      headers: { Authorization: `Bearer ${getCookie("token")}` }, // Sử dụng "Bearer" trước token
    },
  );
};

export const getPostGroup = (groupId: number) => {
  return axiosClient.get(END_POINT.GROUP_POST + "/" + groupId, {});
};

export const postingGroup = (payload: Posting) => {
  return axiosClient.post(
    END_POINT.POSTING,
    {
      content: payload.content,
      time: payload.time,
      groupId: payload.groupId,
      titles: payload.titles,
      userId: payload.userId,
    },
    {
      headers: { Authorization: `Bearer ${getCookie("token")}` }, // Sử dụng "Bearer" trước token
    },
  );
};

export const editPost = (payload: Posting, postID: number) => {
  return axiosClient.post(
    END_POINT.EDIT_POST + "?postid=" + postID,
    {
      content: payload.content,
      time: payload.time,
      groupId: payload.groupId,
      titles: payload.titles,
    },
    {
      headers: { Authorization: `Bearer ${getCookie("token")}` }, // Sử dụng "Bearer" trước token
    },
  );
};

export const like = (post: number, user: string) => {
  console.log(getCookie("token")?.toString());

  return axiosClient.post(
    END_POINT.LIKE + "/" + post + "?user=" + user,
    {},
    {
      headers: { Authorization: `Bearer ${getCookie("token")}` }, // Sử dụng "Bearer" trước token
    },
  );
};

export const disLike = (post: number, user: string) => {
  return axiosClient.post(
    END_POINT.DIS_LIKE + "/" + post + "?user=" + user,
    {},
    {
      headers: { Authorization: `Bearer ${getCookie("token")}` }, // Sử dụng "Bearer" trước token
    },
  );
};

export const deletePost = (postID: number) => {
  return axiosClient.post(
    END_POINT.DELETE_POST + "/" + postID,
    {},
    {
      headers: { Authorization: `Bearer ${getCookie("token")}` }, // Sử dụng "Bearer" trước token
    },
  );
};

export const findPost = (content: string) => {
  return axiosClient.post(END_POINT.POSTING, {
    findContent: content,
  });
};

export const donatePost = (postId: number, coins: number) => {
  return axiosClient.post(
    END_POINT.DONATE_POST + "/" + postId + "?coins=" + coins,
    {},
    {
      headers: { Authorization: `Bearer ${getCookie("token")}` }, // Sử dụng "Bearer" trước token
    },
  );
};

export const reportPost = (
  postId: number,
  userId: number,
  typeId: number,
  description: string,
) => {
  return axiosClient.post(
    END_POINT.POST_REPORT +
      "/" +
      postId +
      "?userid=" +
      userId +
      "&typeid=" +
      typeId +
      "&description=" +
      description,
    {},
    {
      headers: { Authorization: `Bearer ${getCookie("token")}` }, // Sử dụng "Bearer" trước token
    },
  );
};

export const getAllSavePost = () => {
  return axiosClient.get(END_POINT.POST_SAVE_ALL, {
    headers: { Authorization: `Bearer ${getCookie("token")}` }, // Sử dụng "Bearer" trước token
  });
};
