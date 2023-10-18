
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState, useSetRecoilState } from "recoil";
import { authModelState } from "../atoms/authModalAtom";
import {
  Community,
  CommunitySnippet,
  CommunityState,
} from "../atoms/CommunitiesAtom";
import { auth, firestore } from "../firebase/clientApp";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { exitGroup, getAllGroup, getGroupData, getGroupJoin, joinGroup } from "../../apis/groups";

const useCommunityData = () => {
  const user = useSelector((state:RootState)=> state.userInfor.currentUser);
  const router = useRouter();
  const setAuthModelState = useSetRecoilState(authModelState);
  const [communityStateValue, setCommunityStateValue] =
    useRecoilState(CommunityState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onJoinOrCommunity = async (communityData: Community, isJoined: boolean) => {
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

      const snippetList:CommunitySnippet[] = (await allGroup).data;
      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: snippetList as CommunitySnippet[],
        snippetsFetched: true,
      }));

    } catch (error: any) {
      console.log("Get My Snippet Error", error);
      setError(error.message);
    }
    setLoading(false);
  };

  const getCommunityData = async (communityId: string) => {
    try {
      const getGroupDTO = await getGroupData(communityId);
      const groupData = getGroupDTO.data; 
      console.log("grdata"+groupData);
      
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

  const joinCommunity = async (communityData: Community) => {
    try {

      const newSnippet: CommunitySnippet = {
        groupId: communityData.groupId,
        imageURLGAvatar: communityData.imageURLGAvatar || "",
        isModerator: user?.userName === communityData.host,
        timeCreate: new Date(),
        groupName: communityData.groupName
      };
      
      await joinGroup(communityData.groupId);

      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: [...prev.mySnippets, newSnippet],
      }));

      // updateCommunitySnippet(communityData, user?.u!);
    } catch (error: any) {
      console.log("JoinCommunity Error", error);
      setError(error.message);
    }
    setLoading(false);
  };

  // const updateCommunitySnippet = async (
  //   communityData: Community,
  //   userId: string
  // ) => {
  //   if (!communityData && !userId) return;

  //   try {
  //     const batch = writeBatch(firestore);

  //     const newSnippet = {
  //       userId: userId,
  //       userEmail: user?.email,
  //     };

  //     batch.set(
  //       doc(
  //         firestore,
  //         `communities/${communityData.id}/userInCommunity/${userId}`
  //       ),
  //       newSnippet
  //     );

  //     await batch.commit();
  //   } catch (error: any) {
  //     console.log("JoinCommunity Error", error);
  //     setError(error.message);
  //   }
  // };

  const leaveCommunity = async (communityId: number) => {
    try {
       await exitGroup(communityId);

      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: prev.mySnippets.filter(
          (item) => item.groupId !== communityId
        ),
      }));
    } catch (error: any) {
      console.log("JoinCommunity Error", error);
      setError(error.message);
    }
    setLoading(false);
  };

  return {
    communityStateValue,
    onJoinOrCommunity,
    loading,
  };
};
export default useCommunityData;
