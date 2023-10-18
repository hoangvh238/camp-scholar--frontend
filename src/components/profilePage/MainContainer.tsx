import { Stack } from "@chakra-ui/react";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

import { Post, Like } from "../../atoms/PostAtom";
import { auth, firestore } from "../../firebase/clientApp";
import useCommunityData from "../../hooks/useCommunityData";
import usePosts from "../../hooks/usePosts";
import Recommendation from "../Community/Recommendation";
import PageContent from "../Layout/PageContent";
import PostItem from "../posts/PostItem";
import PostLoader from "../posts/PostLoader";
import NoPost from "./NoPost";
import ProfileSide from "./ProfileSide";
import ProfileTopBar from "./ProfileTopBar";
import { User } from "@/atoms/userAtom"
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import userProfile from "@/hooks/userProfile";
import NotFound from "../Community/NotFound";
import { getAllPost, getPostByLike, getPostByTime } from "../../../apis/posts";
type Props = {
  slug: string | undefined
};

function MainContainer({ slug }: Props) {
  const {
    user,
    setUser,
    onLoad
  } = userProfile();
  const router = useRouter();
  const slugdata = router.query.slug?.toString();
  const currenUser = useSelector((state: RootState) => state.userInfor.currentUser);

  useEffect(() => {
    if (slugdata) onLoad(slugdata)
  }, [slugdata])


  const [loading, setLoading] = useState(false);
  const {
    postStateValue,
    setPostStateValue,
    onDeletePost,
    onSelectPost,
    onVote,
  } = usePosts();
  const { communityStateValue } = useCommunityData();


  const buildNoUserHomeFeed = async () => {
    setLoading(true);
    try {
      const postData = await getAllPost();
      setPostStateValue((prev) => ({
        ...prev,
        posts: postData.data as Post[],
      }));
    } catch (error) {
      console.error("BuildNoUserHome", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    buildNoUserHomeFeed();
  }, []);
  return (
    <>
      {user?.userId ? "" : <NotFound></NotFound>}
      <PageContent>

        <>
          {user?.userId ? <ProfileTopBar /> : ""}
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
        <Stack spacing={5}>
          {currenUser?.userName && user?.userId ? <ProfileSide userData={user} /> : ""}
          {user?.userId ? <Recommendation /> : ""}
        </Stack>
      </PageContent>
    </>

  );
}

export default MainContainer;
