import axiosClient from "../../ultils/axiosClient/index";
import { ValidationError } from "yup";
import {toast} from "react-toastify"
import axios from "axios";

export const END_POINT = {
  GET_ALL_POST: "/api/poster/getPosts",
  DELETEPOST: "/api/poster/deletepost/{postId}",
  EDITPOST: "/api/poster/editpost",
  POSTING : "/api/poster/posting",
  LIKE:"api/poster/like",
  DIS_LIKE : "api/poster/dislike"
};


type Post = { 
  
   postId : number,
   content : string,
   time : Date,
   imageURL : string,
   author : string,
   groupName : string,
   comments : Comment[],
   reports : [],
   likes : Like[]

}

type Comment = { 
  commentId: number,
  postId : number,
  commentParentId : number;
  content: string,
  time: Date,
  author : string,
  reports: [],
  likes: Like[]
}

type Like = {
    likeId : number,
    status : number , 
    time : Date
}   

type Posting = {
  content : string;
  time : Date;
  userId : number;
  groupId : number;
  tiltle : string;
}


export const getAllPost = () => {
  return axiosClient.get(END_POINT.GET_ALL_POST, {
  });
};

export const postingGroup = (payload:Posting) => {
  return axiosClient.post(END_POINT.POSTING,{
      content : payload.content,
      time : payload.time,    
      userId :payload.userId ,
      groupId: payload.groupId,
      title :payload.tiltle, 
  });
};

export const like = (post:number,user:string) =>{
  return axiosClient.post(END_POINT.LIKE+"/"+post+"?user="+user,{
  })
}

export const disLike = (post:number,user:string) =>{
  return axiosClient.post(END_POINT.DIS_LIKE+"/"+post+"?user="+user,{
  })
}


