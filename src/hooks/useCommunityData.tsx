import { RootState } from "@/redux/store";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  exitGroup,
  getGroupData,
  getGroupJoin,
  joinGroup,
} from "../../apis/groups";
import {
  Community,
  CommunitySnippet,
  CommunityState,
} from "../atoms/CommunitiesAtom";
import { authModelState } from "../atoms/authModalAtom";

const useCommunityData = () => {
  const user = useSelector((state: RootState) => state.userInfor.currentUser);
  const router = useRouter();
  const setAuthModelState = useSetRecoilState(authModelState);
  const [communityStateValue, setCommunityStateValue] =
    useRecoilState(CommunityState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onJoinOrCommunity = async (
    communityData: Community,
    isJoined: boolean,
  ) => {
    if (!user.userName) {
      setAuthModelState({ open: true, view: "login" });
      return;
    }

    if (isJoined) {
      await exitGroup(communityData.groupId);
      getMySnippets();
      return;
    }
    await joinGroup(communityData.groupId);
    getMySnippets();
  };

  const getMySnippets = async () => {
    setLoading(true);
    try {
      const allGroup = getGroupJoin(user.userId);
      const snippetList: CommunitySnippet[] = (await allGroup).data;
      const updatedSnippets = snippetList.map((snippet) => {
        const isModerator = snippet.hosts === user.userName;
        return { ...snippet, isModerator };
      });

      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: updatedSnippets,
        snippetsFetched: true,
      }));
    } catch (error: any) {
      console.log("Get My Snippet Error", error);
    }
    setLoading(false);
  };

  const getCommunityData = async (communityId: string) => {
    try {
      const getGroupDTO = await getGroupData(communityId);
      const groupData = getGroupDTO.data;

      setCommunityStateValue((prev) => ({
        ...prev,
        currentCommunity: {
          groupId: groupData,
          ...groupData.data(),
        } as Community,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!user) {
      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: [],
        snippetsFetched: false,
      }));
      return;
    }
    getMySnippets();
  }, [user]);

  useEffect(() => {
    const { communityId } = router.query;

    if (communityId && !communityStateValue.currentCommunity) {
      getCommunityData(communityId as string);
    }
  }, [router.query, communityStateValue.currentCommunity]);

  return {
    communityStateValue,
    onJoinOrCommunity,
    loading,
  };
};
export default useCommunityData;
