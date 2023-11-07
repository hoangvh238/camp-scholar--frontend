import userProfile from "@/hooks/userProfile";
import { RootState } from "@/redux/store";
import {
  Flex,
  Icon,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { BsCalendar4Week } from "react-icons/bs";
import { FaHotjar } from "react-icons/fa";
import { GoGraph } from "react-icons/go";
import { HiArrowSmDown } from "react-icons/hi";
import { MdVerified } from "react-icons/md";
import { useSelector } from "react-redux";
import { countGroup } from "../../../apis/groups";
import { getAllSavePost } from "../../../apis/posts";
import { Post } from "../../atoms/PostAtom";
import usePosts from "../../hooks/usePosts";
import NotFound from "../Community/NotFound";
import Recommendation from "../Community/Recommendation";
import PageContent from "../Layout/PageContent";
import PostItem from "../posts/PostItem";
import PostLoader from "../posts/PostLoader";
import ProfileSide from "./ProfileSide";
type Props = {
  slug: string;
};

function MainContainer({ slug }: Props) {
  const { user, setUser, onLoad } = userProfile();
  const currenUser = useSelector(
    (state: RootState) => state.userInfor.currentUser,
  );

  useEffect(() => {
    if (slug) onLoad(slug);
  }, [slug]);

  const [loading, setLoading] = useState(false);
  const {
    postStateValue,
    setPostStateValue,
    onDeletePost,
    onSelectPost,
    onVote,
  } = usePosts();

  const [countJoin, setCountJoin] = useState(0);
  const bg = useColorModeValue("white", "#1A202C");
  const borderColor = useColorModeValue("gray.300", "#2D3748");
  const hoverBg = useColorModeValue("gray.200", "#2A4365");
  const [AcOrDeSort, setAcOrDeSort] = useState(false); //true acc false dee

  const buildNoUserHomeFeed = async () => {
    setLoading(true);
    try {
      const postData = await getAllSavePost();
      const countData = await countGroup(user.userId);
      setPostStateValue((prev) => ({
        ...prev,
        posts: postData.data as Post[],
      }));
      setCountJoin(countData.data);
    } catch (error) {
      console.error("BuildNoUserHome", error);
    }
    setLoading(false);
  };

  const renderSave = () => {
    buildNoUserHomeFeed();
    renderSaveByTimeAss(true);
  };

  const renderSaveByTimeAss = (value: boolean) => {
    if (value)
      setPostStateValue((prev) => {
        const sortedPosts = [...prev.posts].sort(
          (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime(),
        );
        return {
          ...prev,
          posts: sortedPosts,
        };
      });
    else {
      setPostStateValue((prev) => {
        const sortedPosts = [...prev.posts].sort(
          (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime(),
        );
        return {
          ...prev,
          posts: sortedPosts,
        };
      });
    }
    setAcOrDeSort(value);
  };
  const renderSaveByHot = () => {
    setPostStateValue((prev) => {
      const sortedPosts = [...prev.posts].sort((a, b) => {
        const sumLikesA = a.likes.reduce((acc, like) => acc + like.status, 0);
        const sumLikesB = b.likes.reduce((acc, like) => acc + like.status, 0);
        console.log("vl1" + sumLikesA + "vl2" + sumLikesB);

        return sumLikesA - sumLikesB;
      });
      return {
        ...prev,
        posts: sortedPosts,
      };
    });
  };

  const renderSaveByContact = () => {
    setPostStateValue((prev) => {
      const sortedPosts = [...prev.posts].sort((a, b) => {
        return a.comments.length - b.comments.length;
      });
      return {
        ...prev,
        posts: sortedPosts,
      };
    });
  };
  // useEffect(() => {
  //   if (!user) return;
  //   buildNoUserHomeFeed();

  // }, [user]);
  return (
    <>
      {!user?.userId ? (
        <NotFound></NotFound>
      ) : (
        <PageContent>
          <>
            {user?.userId ? (
              <Tabs isLazy variant="enclosed-colored">
                <Flex
                  justify="start"
                  align="center"
                  bg={bg}
                  height="56px"
                  borderRadius={4}
                  border="1px solid"
                  borderColor={borderColor}
                  p={2}
                >
                  {" "}
                  <TabList className="space-x-2 rounded">
                    <Tab
                      className="rounded-[4px]"
                      _selected={{ color: "white", bg: "blue.500" }}
                    >
                      Đã đăng 📝
                    </Tab>
                    <Tab
                      className="rounded-[4px]"
                      _selected={{ color: "white", bg: "green.400" }}
                      onClick={() => {
                        renderSave();
                      }}
                    >
                      Đã lưu 📌
                    </Tab>
                  </TabList>
                </Flex>
                <TabPanels>
                  <TabPanel>
                    <>
                      <Tabs variant="line" isLazy>
                        <TabList>
                          <Tab>
                            {" "}
                            <Flex
                              mr={1.5}
                              ml={1.5}
                              padding={1}
                              cursor="pointer"
                              alignItems="center"
                              gap={2}
                              borderRadius={4}
                              _hover={{ bg: hoverBg }}
                              display={{ base: "none", md: "flex" }}
                            >
                              <Icon as={MdVerified} fontSize={20} />
                              <Text>Mới</Text>
                            </Flex>
                          </Tab>

                          <Tab color={"red.300"}>
                            <Flex
                              mr={1.5}
                              ml={1.5}
                              padding={1}
                              cursor="pointer"
                              alignItems="center"
                              gap={2}
                              borderRadius={4}
                              _hover={{ bg: hoverBg }}
                              display={{ base: "none", md: "flex" }}
                            >
                              <Icon as={FaHotjar} fontSize={20} />
                              <Text>Hot</Text>
                            </Flex>
                          </Tab>
                        </TabList>
                        <TabPanels></TabPanels>
                      </Tabs>
                    </>
                  </TabPanel>
                  <TabPanel>
                    <Tabs>
                      <TabList>
                        <Tab
                          color={"green.400"}
                          onClick={() => {
                            renderSaveByTimeAss(!AcOrDeSort);
                          }}
                        >
                          <Flex
                            mr={1.5}
                            ml={1.5}
                            padding={1}
                            cursor="pointer"
                            alignItems="center"
                            gap={2}
                            borderRadius={4}
                            _hover={{ bg: hoverBg }}
                          >
                            <Icon
                              as={BsCalendar4Week}
                              fontSize={20}
                              color="green.500"
                            />
                            <span className="flex flex-row">
                              {" "}
                              <Text color="green.500">Ngày{"  "}</Text>
                              <HiArrowSmDown
                                style={{ rotate: AcOrDeSort ? "180deg" : "" }}
                                className="h-5 w-5"
                              ></HiArrowSmDown>
                            </span>
                          </Flex>
                        </Tab>
                        <Tab
                          color={"red.300"}
                          onClick={() => {
                            renderSaveByHot();
                          }}
                        >
                          <Flex
                            mr={1.5}
                            ml={1.5}
                            padding={1}
                            cursor="pointer"
                            alignItems="center"
                            gap={2}
                            borderRadius={4}
                            _hover={{ bg: hoverBg }}
                            display={{ base: "none", md: "flex" }}
                          >
                            <Icon as={FaHotjar} fontSize={20} />
                            <Text>Hot</Text>
                          </Flex>
                        </Tab>
                        <Tab
                          color={"orange.300"}
                          onClick={() => {
                            renderSaveByContact();
                          }}
                        >
                          <Flex
                            mr={1.5}
                            ml={1.5}
                            padding={1}
                            cursor="pointer"
                            alignItems="center"
                            gap={2}
                            borderRadius={4}
                            _hover={{ bg: hoverBg }}
                          >
                            <Icon
                              as={GoGraph}
                              fontSize={20}
                              color="orange.500"
                            />
                            <Text color="orange.500">Độ sôi nổi</Text>
                          </Flex>
                        </Tab>
                      </TabList>
                    </Tabs>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            ) : (
              <div>Không có bài viết nào</div>
            )}
            {loading ? (
              <PostLoader />
            ) : (
              <Stack>
                {postStateValue.posts.map((post, index) => {
                  // Check if post.postVotes is defined before using reduce
                  const votesAmt = post.likes
                    ? post.likes.reduce((acc, vote) => {
                        if (vote.status === 1) return acc + 1;
                        if (vote.status === -1) return acc - 1;
                        return acc;
                      }, 0)
                    : 0;

                  const currentVote = post.likes?.find(
                    (like) => like.auth === user?.userName,
                  );

                  return (
                    <PostItem
                      key={index}
                      post={post}
                      userIsCreator={user?.userName === post.author}
                      userVoteValue={currentVote?.status}
                      onVote={onVote}
                      onSelectPost={onSelectPost}
                      onDeletePost={onDeletePost}
                      votesAmt={votesAmt}
                      commentAmt={post.comments.length}
                    />
                  );
                })}
              </Stack>
            )}
          </>
          <Stack spacing={5}>
            {currenUser?.userName && user?.userId ? (
              <ProfileSide userData={user} totalGroup={countJoin} />
            ) : (
              ""
            )}
            {user?.userId ? <Recommendation /> : ""}
          </Stack>
        </PageContent>
      )}
    </>
  );
}

export default MainContainer;
