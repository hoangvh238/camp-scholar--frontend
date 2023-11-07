import { getCookie } from "cookies-next";
import axiosClient from "../../ultils/axiosClient/index";

export const END_POINT = {
  LIKE: "/api/comment-services/like",
  DIS_LIKE: "/api/comment-services/dislike",
  REPLY: "/api/comment-services/reply-comments",
  COMMENT: "/api/comment-services", // @PostMapping("/{postID}/comments")
  DELETE: "/api/comment-services/delete",
  GET_ALL_COMMENT: "/api/comment-services/all-comments",
};

type Post = {
  postId: number;
  content: string;
  time: Date;
  imageURL: string;
  author: string;
  groupName: string;
  comments: Comment[];
  reports: [];
  likes: Like[];
};

type Comment = {
  commentId: number;
  postId: number;
  commentParentId: number;
  content: string;
  time: Date;
  author: string;
  reports: [];
  likes: Like[];
};

type Like = {
  likeId: number;
  status: number;
  time: Date;
};

type Posting = {
  content: string;
  time: Date;
  userId: number;
  groupId: number;
  titles: string;
};

export const likeComment = (comment: number, user: number) => {
  console.log(getCookie("token")?.toString());

  return axiosClient.post(
    END_POINT.LIKE + "/" + comment + "?userid=" + user,
    {},
    {
      headers: { Authorization: `Bearer ${getCookie("token")}` }, // Sử dụng "Bearer" trước token
    },
  );
};

export const disLikeComment = (comment: number, user: number) => {
  return axiosClient.post(
    END_POINT.DIS_LIKE + "/" + comment + "?userid=" + user,
    {},
    {
      headers: { Authorization: `Bearer ${getCookie("token")}` }, // Sử dụng "Bearer" trước token
    },
  );
};

export const createComment = (
  content: string,
  userId: number,
  postId: number,
  parent: number,
) => {
  return axiosClient.post(
    END_POINT.COMMENT + "/" + postId + "/comments" + "?userid=" + userId,
    {
      commentParentId: parent,
      content: content,
      time: new Date(),
    },
    {
      headers: { Authorization: `Bearer ${getCookie("token")}` }, // Sử dụng "Bearer" trước token
    },
  );
};

export const getAllComment = (postId: number) => {
  return axiosClient.post(
    END_POINT.GET_ALL_COMMENT + "/" + postId,
    {},
    {
      headers: { Authorization: `Bearer ${getCookie("token")}` }, // Sử dụng "Bearer" trước token
    },
  );
};
export const deleteComment = (commentId: number, userId: number) => {
  return axiosClient.post(
    END_POINT.DELETE + "/" + commentId + "?userid=" + userId,
    {},
    {
      headers: { Authorization: `Bearer ${getCookie("token")}` }, // Sử dụng "Bearer" trước token
    },
  );
};

