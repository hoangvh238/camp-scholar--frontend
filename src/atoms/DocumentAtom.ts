import { atom } from "recoil";

export type Document = {
  documentId : number,
  documentName : string,
  description : string,
  time : Date,
  author : string,
  groupName : string,
  cost : number,
  comments : Comment[],
  report : [],
  likes: Like[],
};

// "documentId": 8,
//     "documentName": "New Document Name 8",
//     "description": "New Description 8",
//     "cost": 50,
//     "time": null,
//     "ratings": 0,
//     "groupName": "Cộng đồng trao đổi Toán Học",
//     "author": "taimodels"

export type Like = {
  auth : string
  likeId : number,
  status : number , 
  time : Date
}  

interface PostState {
  selectedPost: Post | null;
  posts: Post[];
}

const defaultPostState: PostState = {
  selectedPost: null,
  posts: [],
};

export const postState = atom<PostState>({
  key: "PostState",
  default: defaultPostState,
});



export type Comment = { 
 commentId: number,
 postId : number,
 commentParentId : number;
 content: string,
 time: Date,
 author : string,
 reports: [],
 likes: Like[]
}


export type Posting = {
 content : string;
 time : Date;
 groupId : number;
 titles : string;
}