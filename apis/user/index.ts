import axiosClient from "../../ultils/axiosClient/index";


export const END_POINT = {
  GET_USER: "/myProfile",
  DELETEPOST: "/api/poster/deletepost/{postId}",
  EDITPOST: "/api/poster/editpost",
  POSTING : "/api/poster/posting"
};



export const getUser = (payload:string) => {
  return axiosClient.get(END_POINT.GET_USER+"/"+payload, {
  });
};

