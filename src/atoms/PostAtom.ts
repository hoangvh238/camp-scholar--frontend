import { atom } from "recoil";

export type Post = {
  postId : number,
  title : string,
  content : string,
  time : Date,
  author : string,
  groupName : string,
  groupId : number,
  comments : Comment[],
  report : [],
  likes: Like[],
};

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