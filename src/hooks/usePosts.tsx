
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { authModelState } from "../atoms/authModalAtom";
import { CommunityState } from "../atoms/CommunitiesAtom";
import { Post, postState, Like } from "../atoms/PostAtom";
import { deletePost, disLike, like } from "../../apis/posts";
import { RootState } from "@/redux/store";4
import { getCookie } from "cookies-next";
import { ValidationError } from "yup";
import { toast } from "react-toastify";
import axios from "axios";
import { createComment, deleteComment, disLikeComment, likeComment } from "../../apis/comments";

const usePosts = () => {
  const [postStateValue, setPostStateValue] = useRecoilState(postState);
  const router = useRouter();
  const user = useSelector((state:RootState)=> state.userInfor.currentUser);
  const setAuthModalState = useSetRecoilState(authModelState);
  const currentCommunity = useRecoilValue(CommunityState).currentCommunity;
  const onVote = async (
    event: React.MouseEvent<Element, MouseEvent>,
    post: number,
    vote: number,
    communityId: string
  ) => {
    event.stopPropagation();
    // check user ?
    console.log(user);
    
    if (!user.userName) {
      setAuthModalState({ open: true, view: "login" });
      return false;
    }
  
    try {    
      if(vote==1)
      await like(post, ( user).userName);
      else  await disLike(post, ( user).userName);
      return true;
    } catch (error) {
      if (error instanceof ValidationError) {
        if (error?.name === "ValidationError") {
          toast.error("Cannot vote");
        }
      }
      if (axios.isAxiosError(error)) {
        if (
          error.response?.status === 501 ||
          error.response?.status === 404 ||
          error.response?.status === 400
        ) {
          return -2;
        }
      }
    }
  };
  const onVoteComment = async (
    event: React.MouseEvent<Element, MouseEvent>,
    comment: number,
    vote: number,
  ) => {
    event.stopPropagation();
    // check user ?
  
    try {    
      if(vote==1)
      await likeComment(comment,user.userId);
      else  await disLikeComment(comment, ( user).userId);
      return true;
    } catch (error) {
      if (error instanceof ValidationError) {
        if (error?.name === "ValidationError") {
          toast.error("Cannot vote");
        }
      }
      if (axios.isAxiosError(error)) {
        if (
          error.response?.status === 501 ||
          error.response?.status === 404 ||
          error.response?.status === 400
        ) {
         
      }
    }
    return false;
    }
  };

  const onComment = async (comment : string, postId:number,parent:number) => {
    console.log("comment"+comment);
    
    try {    
        await createComment(comment,user.userId,postId,parent);
    } catch (error) {
      if (error instanceof ValidationError) {
        if (error?.name === "ValidationError") {
          toast.error("Cannot comment");
        }
      }
      if (axios.isAxiosError(error)) {
        if (
          error.response?.status === 501 ||
          error.response?.status === 404 ||
          error.response?.status === 400
        ) {
          return false;
        }
      }
    }
  }

  const onDeleteComment = async (commentId:number) => {

    try {    
        await deleteComment(commentId,user.userId);
    } catch (error) {
      if (error instanceof ValidationError) {
        if (error?.name === "ValidationError") {
          toast.error("Cannot delete comment");
        }
      }
      if (axios.isAxiosError(error)) {
        if (
          error.response?.status === 501 ||
          error.response?.status === 404 ||
          error.response?.status === 400
        ) {
          return false;
        }
      }
    }
  }

  const onSelectPost = (post: Post) => {
    if (!user.userName) {
      setAuthModalState({ open: true, view: "login" });
      return false;
    }
    setPostStateValue((prev) => ({
      ...prev,
      selectedPost: post,
    }));
    router.push(`/group/post/${post.postId}`);
  };

  const onDeletePost = async (post: Post): Promise<boolean> => {
    try {
      // // check if image delete if exists
      // if (post.imageURL) {
      //   const imageRef = ref(storage, `posts/${post.id}/image`);
      //   await deleteObject(imageRef);
      // }
      // delete post document from firestore
      // const postDocRef = doc(firestore, "posts", post.p!);
      // await deleteDoc(postDocRef);
      await deletePost(post.postId);
      setPostStateValue((prev) => ({
        ...prev,
        posts: prev.posts.filter((item) => item.postId !== post.postId),
      }));

      return true;
    } catch (error) {
      return false;
    }
  };

  const getCommunityPostVotes = async (communityId: string) => {
    // const postVotesQuarry = query(
    //   collection(firestore, "users", `${user?.uid}/postVotes`),
    //   where("communityId", "==", communityId)
    // );

    // const postVoteDocs = await getDocs(postVotesQuarry);
    // const postVotes = postVoteDocs.docs.map((doc) => ({
    //   id: doc.id,
    //   ...doc.data(),
    // }));
    // setPostStateValue((prev) => ({
    //   ...prev,
    //   postVotes: postVotes as Vote[],
    // }));
  };

  // useEffect(() => {
  //   if (!user || !currentCommunity?.id) return;
  //   getCommunityPostVotes(currentCommunity?.id);
  // }, [!user, currentCommunity]);

  // useEffect(() => {
  //   if (!user) {
  //     // if check user ?
  //     setPostStateValue((prev) => ({
  //       ...prev,
  //       postVotes: [],
  //     }));
  //   }
  // }, [user]);

  return {
    postStateValue,
    setPostStateValue,
    onVote,
    onSelectPost,
    onDeletePost,
    onVoteComment,
    onComment,
    onDeleteComment
  };
};

export default usePosts;
