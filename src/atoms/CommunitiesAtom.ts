import { Timestamp } from "firebase/firestore";
import { atom } from "recoil";

export interface Community {
  groupId: number;
  groupName: string;
  auth : string;
  tags: string;
  description: string;
  imageURLGAvatar: string;
  imageURL?: string;
  timeCreate : Date;
  category : string
}


export interface CommunitySnippet {
  groupId: string;
  isModerator?: boolean;
  imageURL?: string;
  timeCreate?: Date;
}

interface CommunityState {
  mySnippets: CommunitySnippet[];
  currentCommunity?: Community;
  snippetsFetched: boolean;
}

export const defaultCommunityState: CommunityState = {
  mySnippets: [],
  snippetsFetched: false,
};

export const CommunityState = atom<CommunityState>({
  key: "communityState",
  default: defaultCommunityState,
});
