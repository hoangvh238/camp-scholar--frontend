import { Timestamp } from "firebase/firestore";
import { atom } from "recoil";

export interface Community {
  groupId: number;
  groupName: string;
  host: string;
  hashtag: string;
  description: string;
  imageURLGAvatar : string;
  imageUrlGCover : string;
  timeCreate: Date;
  category: string
}

export interface CommunitySnippet {
  groupId: number;
  groupName: string
  isModerator?: boolean;
  imageURLGAvatar?: string;
  timeCreate?: Date;
}

interface CommunityState {
  mySnippets: CommunitySnippet[];
  currentCommunity?: Community;
  snippetsFetched: boolean;
}

export type CreateGroup = {
  groupName: string,
  description: string;
  timeCreate: Date;
  category: string;
  hashtag: string;
}

export type UpdateImage = {
  imageURLGAvatar : string;
  imageUrlGCover : string;
}

export type UpdateInFor = {
  description: string;
}

export const defaultCommunityState: CommunityState = {
  mySnippets: [],
  snippetsFetched: false,
};

export const CommunityState = atom<CommunityState>({
  key: "communityState",
  default: defaultCommunityState,
});
