import axiosClient from "../../ultils/axiosClient/index";
import { ValidationError } from "yup";
import { toast } from "react-toastify"
import axios from "axios";

export const END_POINT = {
  GROUP_CREATE: "/group/create",
  GROUP_DATA: "/group",
  EDITPOST: "/api/postservices/editpost",
  POSTING: "/api/postservices/posting"
};



type GROUP_CREATE = {
  descriptions: string,
  groups_Name: string,
  create_Time: Date,
  category_Id: number,
  user_Id: number;
  hashtag: string
}



export const createGroup = (payload: GROUP_CREATE) => {
  return axiosClient.post(END_POINT.GROUP_DATA, {
    description: payload.descriptions,
    groupName: payload.groups_Name,
    timeCreate: payload.create_Time,
    // category : payload.category_Id, 
    hosts: payload.user_Id,
    // tags : payload.hashtag
  });
};


export const getGroupData = (groupID:string) => {
  return axiosClient.get(END_POINT.GROUP_DATA+"/"+groupID, {
  
  });
};