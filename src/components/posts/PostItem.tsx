import {
  Alert,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertIcon,
  Button,
  Collapse,
  Divider,
  Flex,
  Icon,
  Image,
  Spinner,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { BsChat, BsDot } from "react-icons/bs";
import { HiOutlineUserGroup } from "react-icons/hi2";

import { Community } from "@/atoms/CommunitiesAtom";
import {
  IoArrowDownCircleOutline,
  IoArrowDownCircleSharp,
  IoArrowUpCircleOutline,
  IoArrowUpCircleSharp,
  IoBookmarkOutline,
} from "react-icons/io5";

import useCommunityData from "@/hooks/useCommunityData";
import { RootState } from "@/redux/store";
import { message } from "antd";
import { getCookie, setCookie } from "cookies-next";
import { MdReportGmailerrorred } from "react-icons/md";
import { useSelector } from "react-redux";
import { savePost } from "../../../apis/posts";
import { formatTimeToNow } from "../../../ultils/utils";
import { Post } from "../../atoms/PostAtom";
import ReportModal from "../Modal/Report/ReportModal";
import Level from "../common/Level";
import EditorOutput from "../editor/EditorOutput";
import Donate from "./postService/Donate";

type PostItemProps = {
  post: Post;
  userIsCreator: boolean;
  onVote: (
    event: React.MouseEvent<Element, MouseEvent>,
    post: number,
    vote: number,
    communityId: string,
  ) => any;
  votesAmt: number;
  commentAmt: number;
  userVoteValue?: number;
  onDeletePost: (post: Post) => Promise<boolean>;
  onSelectPost?: (post: Post) => void;
  homePage?: boolean;
};
const PostItem: React.FC<PostItemProps> = ({
  post,
  userIsCreator,
  userVoteValue,
  votesAmt: _votesAmt,
  onVote,
  commentAmt,
  onDeletePost,
  onSelectPost,
  homePage,
}) => {
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [openReport, setOpenReport] = useState(false);
  const [error, setError] = useState(false);
  const singlePostPage = !onSelectPost;
  const [votesAmt, setVotesAmt] = useState<number>(_votesAmt);
  const [currentVote, setCurrentVote] = useState<number | undefined>(
    userVoteValue,
  );
  const singlePostView = true; // function not passed to [pid]
  const pRef = useRef<HTMLParagraphElement>(null);
  const router = useRouter();
  const user = useSelector((state: RootState) => state.userInfor.currentUser);

  const { communityStateValue, onJoinOrCommunity, loading } =
    useCommunityData();

  const [hover, setHover] = useState(false);
  const [isReading, setIsReading] = useState(false);

  const [isReport, setIsReport] = useState<boolean>(false);

  const [isSaved, setIsSaved] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<any | null>(null);

  // Thames
  const bg = useColorModeValue("white", "#1A202C");
  const borderColor = useColorModeValue("gray.300", "#2D3748");
  const singlePageBorderColor = useColorModeValue("white", "#2D3748");
  const voteLineBorderColor = useColorModeValue("gray.100", "#171923");
  const IconHoverBg = useColorModeValue("gray.200", "#2A4365");
  const IconBg = useColorModeValue("none", "#A0AEC0");
  const voteIconBg = useColorModeValue("gray.400", "#CBD5E0");
  const voteIconBgUP = useColorModeValue("#2E97A7", "#A2FF86");
  const voteIconBgDown = useColorModeValue("#C70039", "#C70039");
  const handleDelete = async (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    event.stopPropagation();
    setLoadingDelete(true);
    try {
      const success = await onDeletePost(post);

      if (!success) {
        message.error("Xóa bài thất bại");
      }
      message.success("Xóa bài thành công");
      if (singlePostPage) {
        router.push(`/group/${post.groupId}`);
      }
    } catch (error: any) {
      setError(error.message);
    }
    setLoadingDelete(false);
  };

  const voteColor = () => {
    if (votesAmt > 0) return voteIconBgUP;
    if (votesAmt < 0) return voteIconBgDown;
    return voteIconBg;
  };

  const isJoined = () => {
    return communityStateValue.mySnippets.find(
      (item) => item.groupId === post?.groupId,
    );
  };

  const isLastReport = (): boolean =>
    post.report?.some((element) => element.user === user.userId);

  const HandleJoinGroup = () => {
    const gr: Community = {
      groupId: post.groupId,
      groupName: "",
      hosts: "",
      hashtag: "",
      description: "",
      imageURLGAvatar: "",
      imageUrlGCover: "",
      category: "",
      timeCreate: new Date(),
    };
    onJoinOrCommunity(gr, false);
    onClose();
  };

  const handleLike = async (event: React.MouseEvent<Element, MouseEvent>) => {
    if (!(await onVote(event, post.postId, 1, post.groupName))) return;
    if (!isJoined()) {
      onOpen();
      return;
    }

    if (currentVote === 1) {
      handleSetAmt(votesAmt - 1);
      handleVoting(0);
    } else if (currentVote === -1) {
      handleSetAmt(votesAmt + 2);
      handleVoting(1);
    } else {
      handleSetAmt(votesAmt + 1);
      handleVoting(1);
    }
  };
  const handleSavePost = async () => {
    try {
      await savePost(post.postId);
      handleSavePostCookies(post.postId);
      setIsSaved(!isSaved);
    } catch (error) {
      message.error("Lưu thất bại");
      console.log(error);
    }
  };

  const isPostSaved = (postId: number): boolean => {
    // Lấy danh sách bài viết đã lưu từ cookie
    const savedPostsStr = getCookie("saved-posts") || "[]"; // Đảm bảo kiểu dữ liệu của savedPostsStr là một chuỗi JSON

    // Chuyển chuỗi JSON thành mảng
    const savedPosts: any[] = JSON.parse(savedPostsStr);

    return savedPosts.some((savedPost: any) => savedPost.postId === postId);
  };

  const handleSavePostCookies = async (postId: number) => {
    try {
      // Lấy danh sách bài viết đã lưu từ cookie
      const savedPostsStr = getCookie("saved-posts") || "[]"; // Đảm bảo kiểu dữ liệu của savedPostsStr là một chuỗi JSON

      // Chuyển chuỗi JSON thành mảng
      const savedPosts: any[] = JSON.parse(savedPostsStr);

      // Kiểm tra xem bài viết hiện tại đã được lưu chưa
      const isPostSaved = savedPosts.some(
        (savedPost: any) => savedPost.postId === postId,
      );

      if (isPostSaved) {
        // Nếu đã lưu, hãy xóa nó ra khỏi danh sách
        const updatedSavedPosts = savedPosts.filter(
          (savedPost: any) => savedPost.postId !== postId,
        );
        setCookie("saved-posts", JSON.stringify(updatedSavedPosts)); // Lưu lại dưới dạng chuỗi JSON
        message.success("Bài viết đã bị xóa khỏi danh sách lưu.");
      } else {
        // Nếu chưa lưu, thêm bài viết vào danh sách
        savedPosts.push({ postId }); // Lưu dưới dạng đối tượng chứa postId
        setCookie("saved-posts", JSON.stringify(savedPosts)); // Lưu lại dưới dạng chuỗi JSON
        message.success("Bài viết đã được lưu.");
      }
    } catch (error) {
      message.error("Lưu thất bại");
      console.log(error);
    }
  };

  const handleDisLike = async (
    event: React.MouseEvent<Element, MouseEvent>,
  ) => {
    if (!(await onVote(event, post.postId, -1, post.groupName))) return;
    if (!isJoined()) {
      onOpen();
      return;
    }
    if (currentVote === 1) {
      handleSetAmt(votesAmt - 2);
      handleVoting(-1);
    } else if (currentVote === -1) {
      handleSetAmt(votesAmt + 1);
      handleVoting(0);
    } else {
      handleSetAmt(votesAmt - 1);
      handleVoting(-1);
    }
  };

  const handleSetAmt = (value: number) => {
    setVotesAmt(value);
  };

  const handleVoting = (vote: number) => {
    setCurrentVote(vote);
  };

  useEffect(() => {
    setIsReport(isLastReport());
  }, []);

  useEffect(() => {
    const savedPosts = JSON.parse(localStorage.getItem("saved-posts") || "[]");
    setIsSaved(savedPosts.includes(post.postId));
  }, []);

  useEffect(() => {
    const savedPosts = JSON.parse(localStorage.getItem("saved-posts") || "[]");
    if (isSaved) {
      localStorage.setItem(
        "saved-posts",
        JSON.stringify([...savedPosts, post.postId]),
      );
    } else {
      localStorage.setItem(
        "saved-posts",
        JSON.stringify(savedPosts.filter((id: number) => id !== post.postId)),
      );
    }
  }, [isSaved]);

  return (
    <Flex
      border="1px solid"
      bg={bg}
      borderColor={singlePostPage ? singlePageBorderColor : borderColor}
      borderRadius={singlePostPage ? "4px 4px 0px 0px" : "4px"}
      _hover={{ borderColor: singlePostPage ? "none" : borderColor }}
      cursor={singlePostPage ? "unset" : "pointer"}
    >
      <>
        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Tham gia ngay
              </AlertDialogHeader>

              <AlertDialogBody>
                Bạn nó muốn tham gia nhóm : {post.groupName}
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} bg={"blue.200"} onClick={onClose}>
                  Thoát
                </Button>
                <Button
                  colorScheme="red"
                  bg={"orange.500"}
                  onClick={HandleJoinGroup}
                  ml={3}
                >
                  Tham gia
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </>
      <Flex
        direction="column"
        align="center"
        bg={singlePostPage ? "none" : voteLineBorderColor}
        p={2}
        width="40px"
        borderRadius={singlePostPage ? "0" : "3px 0px 0px 3px"}
      >
        <Icon
          as={currentVote === 1 ? IoArrowUpCircleSharp : IoArrowUpCircleOutline}
          color={currentVote === 1 ? "brand.100" : voteIconBg}
          fontSize={22}
          onClick={(event) => handleLike(event)}
          cursor="pointer"
        />
        <Text fontSize="11pt" color={voteColor()} fontWeight={"bold"}>
          {votesAmt}
        </Text>
        <Icon
          as={
            currentVote === -1
              ? IoArrowDownCircleSharp
              : IoArrowDownCircleOutline
          }
          color={currentVote === -1 ? "#4379ff" : voteIconBg}
          fontSize={22}
          onClick={(event) => handleDisLike(event)}
          cursor="pointer"
        />
      </Flex>
      <Flex direction="column" width="100%">
        {error && (
          <Alert status="error">
            <AlertIcon />
            <Text mr={2}>{error}</Text>
          </Alert>
        )}
        <Stack spacing={1} p="10px">
          <Stack direction="row" spacing={0.5} align="center" fontSize="9pt">
            {/* check */}
            {true && (
              <>
                {false ? (
                  <Image src={"/"} borderRadius="full" boxSize="18px" mr={2} />
                ) : (
                  <Icon
                    as={HiOutlineUserGroup}
                    fontSize="18px"
                    color="blue.500"
                  />
                )}

                <Link href={`/group/${post.groupId}`}>
                  <Text
                    fontWeight={700}
                    _hover={{ textDecoration: "underline" }}
                    onClick={(event) => event.stopPropagation}
                  >{`Nhóm/${post.groupName}`}</Text>
                </Link>
                <Icon as={BsDot} color="gray.500" fontSize={8} />
              </>
            )}
            <Text className="pr-1">Đăng bởi</Text>
            <Stack direction="row" className="pr-1">
              {" "}
              <Level point={post.authorPoints}></Level>
            </Stack>
            <Text>
              <Link className="font-bold" href={`/profile/${post.author}`}>
                {post.author}
              </Link>{" "}
            </Text>
            <Icon as={BsDot} color="gray.500" fontSize={8} />
            <Text> {formatTimeToNow(new Date(post.time))}</Text>
          </Stack>
          <div
            onMouseMove={() => setIsReading(true)}
            onMouseLeave={() => setIsReading(false)}
            onClick={() => onSelectPost && onSelectPost(post)}
          >
            {post.titles ? (
              <>
                {/* <Divider></Divider>
              <Text>{post.titles}</Text> */}
              </>
            ) : (
              ""
            )}
            <Collapse
              startingHeight={post.content?.length < 600 ? 50 : 400}
              in={isReading}
            >
              {/* <Divider></Divider> */}
              <EditorOutput content={post.content} />
              <Divider></Divider>
            </Collapse>
          </div>

          <div
            className="relative pt-[20px] text-sm  w-full overflow-clip"
            ref={pRef}
            onMouseMove={() => setIsReading(true)}
            onMouseLeave={() => setIsReading(false)}
            onClick={() => onSelectPost && onSelectPost(post)}
          >
            <div
              style={
                !isReading ? { maxHeight: "200px" } : { maxHeight: "10000px" }
              }
            ></div>
            {pRef.current ? (
              pRef.current.clientHeight >= 500 ? (
                // blur bottom if content is too long
                <div className="absolute bottom-0 left-0 w-full">
                  <div
                    className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-white to-white-10 "
                    onClick={() => setIsReading(!isReading)}
                  >
                    <div className="absolute bottom-0 left-0 w-full">
                      <div className="flex content-center justify-center w-full">
                        {hover ? (
                          <Image
                            className="absolute bottom-0"
                            style={
                              isReading
                                ? { transform: "rotate(180deg)" }
                                : { transform: "rotate(0deg)" }
                            }
                            src={""}
                            alt=""
                          />
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : null
            ) : null}
          </div>
        </Stack>
        <Flex ml={1} mb={0.5} color="gray.500" fontWeight={600}>
          <Flex
            align="center"
            p="8px 10px"
            borderRadius={4}
            _hover={{ bg: IconHoverBg }}
            cursor="pointer"
          >
            <Icon as={BsChat} mr={2} color={IconBg} />
            <Text fontSize="9pt" color={IconBg}>
              {commentAmt}
            </Text>
          </Flex>

          {user?.userName && (
            <>
              {" "}
              {user?.userName == post.author ? (
                ""
              ) : (
                <Donate postId={post.postId} type={"post"}></Donate>
              )}
              <Flex
                align="center"
                p="8px 10px"
                borderRadius={4}
                _hover={{ bg: IconHoverBg }}
                cursor="pointer"
                onClick={handleSavePost}
              >
                <Icon
                  as={IoBookmarkOutline}
                  mr={2}
                  color={isPostSaved(post.postId) ? "green.400" : IconBg}
                />
                <Text
                  fontSize="9pt"
                  color={isPostSaved(post.postId) ? "green.400" : IconBg}
                >
                  Lưu
                </Text>
              </Flex>
              <Flex
                color={isReport ? "red.400" : ""}
                align="center"
                p="8px 10px"
                borderRadius={4}
                _hover={{ bg: IconHoverBg }}
                cursor="pointer"
                onClick={
                  isReport
                    ? () => {}
                    : () => {
                        setOpenReport(true);
                      }
                }
              >
                <ReportModal
                  setIsReport={setIsReport}
                  postId={post.postId}
                  open={openReport}
                  handleClose={() => {
                    setOpenReport(false);
                  }}
                ></ReportModal>
                <Icon
                  as={MdReportGmailerrorred}
                  mr={2}
                  color={isReport ? "red.600" : IconBg}
                />
                <Text fontSize="9pt" color={IconBg}>
                  Báo cáo
                </Text>
              </Flex>
              {userIsCreator && (
                <Flex
                  align="center"
                  p="8px 10px"
                  borderRadius={4}
                  _hover={{ bg: IconHoverBg }}
                  cursor="pointer"
                  onClick={handleDelete}
                >
                  {loadingDelete ? (
                    <Spinner size="sm" />
                  ) : (
                    <>
                      <Icon as={AiOutlineDelete} mr={2} color={IconBg} />
                      <Text fontSize="9pt" color={IconBg}>
                        Delete
                      </Text>
                    </>
                  )}
                </Flex>
              )}
            </>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};
export default PostItem;
