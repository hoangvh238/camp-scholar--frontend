import { Stack } from "@chakra-ui/react";
import { query, collection, where, orderBy, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Community } from "../../atoms/CommunitiesAtom";
import { Post } from "../../atoms/PostAtom";
import { auth, firestore } from "../../firebase/clientApp";
import usePosts from "../../hooks/usePosts";
import PostItem from "./PostItem";
import PostLoader from "./PostLoader";
import { getGroupPost } from "../../../apis/groups";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { getPostGroup } from "../../../apis/posts";

type PostsProps = {
  communityData: Community;
  userId?: string;
};

const Posts: React.FC<PostsProps> = ({ communityData }) => {
  // if user ?
  const user = useSelector((state:RootState) => state.userInfor.currentUser)
  const [loading, setLoading] = useState(false);
  const {
    postStateValue,
    setPostStateValue,
    onVote,
    onSelectPost,
    onDeletePost,
  } = usePosts();

  const getPost = async () => {
    try {
      setLoading(true);
      // get posts for this community
      const getData = await getPostGroup(communityData.groupId);
      const posts = getData.data;
      console.log("dataa"+posts);
      
      setPostStateValue((prev) => ({
        ...prev,
        posts: posts as Post[],
      }));

      //console.log(posts);
    } catch (error: any) {
      console.log("get post error", error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    getPost();
  }, [communityData]);

  return (
    <>
      {loading ? (
        <PostLoader />
      ) : (
        <Stack>
         {postStateValue.posts.map((post, index) => {
                // Check if post.postVotes is defined before using reduce
                const votesAmt = post.likes ? post.likes.reduce((acc, vote) => {
                  if (vote.status === 1) return acc + 1;
                  if (vote.status === -1) return acc - 1;
                  return acc;
                }, 0) : 0;

                const currentVote = post.likes?.find((like) => like.auth === user?.userName);


                return (

                  <PostItem
                    key={index}
                    post={post}
                    userIsCreator={user?.userName === post.author}
                    userVoteValue={currentVote?.status}
                    onVote={onVote}
                    onSelectPost={onSelectPost}
                    onDeletePost={onDeletePost} votesAmt={votesAmt} commentAmt={post.comments.length}
                  />
                )
              })}
        </Stack>
      )}
    </>
  );
};
export default Posts;
