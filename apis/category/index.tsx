import axiosClient from "../../ultils/axiosClient/index";

import { getCookie } from "cookies-next";
export const END_POINT = {
  CATE : "/api/category/getAll",
  HASHTAG : "/api/category/getHintTag",
};



export const getFullCate = () => {
  return axiosClient.get(END_POINT.CATE, {
  });
};

export const getHashTag = (cateID:number) => {
  return axiosClient.get(END_POINT.HASHTAG+"/"+cateID, {
  });
};

