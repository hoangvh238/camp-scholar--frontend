import axiosClient from "../../ultils/axiosClient/index";
import { getCookie } from "cookies-next";

export const END_POINT = {
  GET_ALL_POST: "/api/poster/getPosts",
  DELETE_POST: "/api/poster/deletepost",
  EDIT_POST: "/api/poster/editpost",
  POSTING: "/api/poster/posting",
  LIKE: "api/poster/like",
  DIS_LIKE: "api/poster/dislike",
  POST_REPORT: "api/poster/report",
  FIND_POST: "api/poster/find-post",
  DONATE_POST :"api/poster/donate",
  GROUP_POST : "api/poster/groupPost",
  POST_LIKE : "api/poster/getPostDTObylike",
  POST_COMMENT : "api/poster/getPostDTObycomment",
  POST_TIME : "api/poster/getPostDTObytime",
};


type Post = {

  postId: number,
  content: string,
  time: Date,
  imageURL: string,
  author: string,
  groupName: string,
  comments: Comment[],
  reports: [],
  likes: Like[]

}

type Comment = {
  commentId: number,
  postId: number,
  commentParentId: number;
  content: string,
  time: Date,
  author: string,
  reports: [],
  likes: Like[]
}

type Like = {
  likeId: number,
  status: number,
  time: Date
}

type Posting = {
  content: string;
  time: Date;
  userId: number;
  groupId: number;
  titles: string;
}


export const getAllPost = () => {
  return axiosClient.get(END_POINT.GET_ALL_POST, {
  });
};

export const getPostByComment = () => {
  return axiosClient.get(END_POINT.POST_COMMENT, {
  });
};

export const getPostByLike = () => {
  return axiosClient.get(END_POINT.POST_LIKE, {
  });
};

export const getPostByTime = () => {
  return axiosClient.get(END_POINT.POST_TIME, {
  });
};

export const getPostGroup = (groupId:number) => {
  return axiosClient.get(END_POINT.GROUP_POST+"/"+groupId, {
  });
};

export const postingGroup = (payload: Posting) => {
  return axiosClient.post(END_POINT.POSTING, {
    content: payload.content,
    time: payload.time,
    groupId: payload.groupId,
    titles: payload.titles,
    userId : payload.userId
  }, {
    headers: { Authorization: `Bearer ${getCookie("token")}` }, // Sử dụng "Bearer" trước token
  });
};

export const editPost = (payload: Posting, postID: number) => {
  return axiosClient.post(END_POINT.EDIT_POST + "?postid=" + postID, {
    content: payload.content,
    time: payload.time,
    groupId: payload.groupId,
    titles: payload.titles,
  }, {
    headers: { Authorization: `Bearer ${getCookie("token")}` }, // Sử dụng "Bearer" trước token
  });
};


export const like = (post: number, user: string) => {
  console.log(getCookie("token")?.toString());

  return axiosClient.post(END_POINT.LIKE + "/" + post + "?user=" + user, {},{
    headers: { Authorization: `Bearer ${getCookie("token")}` }, // Sử dụng "Bearer" trước token
  })
}

export const disLike = (post: number, user: string) => {
  return axiosClient.post(END_POINT.DIS_LIKE + "/" + post + "?user=" + user, {},{
    headers: { Authorization: `Bearer ${getCookie("token")}` }, // Sử dụng "Bearer" trước token
  })
}


export const deletePost = (postID: number) => {
  return axiosClient.post(END_POINT.DELETE_POST + "/" + postID, {},{
    headers: { Authorization: `Bearer ${getCookie("token")}` }, // Sử dụng "Bearer" trước token
  });
};

export const findPost = (content: string) => {
  return axiosClient.post(END_POINT.POSTING, {
    findContent: content
  });
};

export const donatePost = (postId: number,coins:number) => {
  return axiosClient.post(END_POINT.DONATE_POST+"/"+postId+"?coins="+coins, {},{
    headers: { Authorization: `Bearer ${getCookie("token")}` }, // Sử dụng "Bearer" trước token
  });
};
