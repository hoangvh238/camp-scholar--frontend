import axiosClient from "../../ultils/axiosClient/index";

export const END_POINT = {
  SEARCH_POST: "/api/poster/search",
  SEARCH_GROUP: "/group/search",
  SEARCH_DOCUMENT: "/doc/search",
};

export const searchPost = (search: string) => {
  return axiosClient.get(END_POINT.SEARCH_POST, {
    params: { key: search },
  });
};

export const searchDoc = (search: string) => {
  return axiosClient.get(END_POINT.SEARCH_DOCUMENT, {
    params: { key: search },
  });
};

export const searchGroup = (search: string) => {
  return axiosClient.get(END_POINT.SEARCH_GROUP, {
    params: { key: search },
  });
};
