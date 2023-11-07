import { RootState } from "@/redux/store";
import axios from "axios";
import { useRouter } from "next/router";
import React from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useRecoilState, useSetRecoilState } from "recoil";
import { ValidationError } from "yup";
import {
  createComment,
  deleteComment,
  disLikeComment,
  likeComment,
} from "../../apis/comments";
import { deletePost, disLike, like } from "../../apis/posts";
import { Post, postState } from "../atoms/PostAtom";
import { authModelState } from "../atoms/authModalAtom";

const usePosts = () => {
  const [postStateValue, setPostStateValue] = useRecoilState(postState);
  const router = useRouter();
  const user = useSelector((state: RootState) => state.userInfor.currentUser);
  const setAuthModalState = useSetRecoilState(authModelState);
  const onVote = async (
    event: React.MouseEvent<Element, MouseEvent>,
    post: number,
    vote: number,
    communityId: string,
  ) => {
    event.stopPropagation();

    if (!user.userName) {
      setAuthModalState({ open: true, view: "login" });
      return false;
    }

    try {
      if (vote == 1) await like(post, user.userName);
      else await disLike(post, user.userName);
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
      if (vote == 1) await likeComment(comment, user.userId);
      else await disLikeComment(comment, user.userId);
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

  const onComment = async (comment: string, postId: number, parent: number) => {
    try {
      await createComment(comment, user.userId, postId, parent);
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
  };

  const onDeleteComment = async (commentId: number) => {
    try {
      await deleteComment(commentId, user.userId);
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
  };

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

  return {
    postStateValue,
    setPostStateValue,
    onVote,
    onSelectPost,
    onDeletePost,
    onVoteComment,
    onComment,
    onDeleteComment,
  };
};

export default usePosts;
