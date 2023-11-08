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
  Divider,
  Flex,
  Icon,
  Image,
  Spinner,
  Stack,
  Text,
  Tooltip,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useRef, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { BsChat, BsDot } from "react-icons/bs";
import { HiOutlineUserGroup } from "react-icons/hi2";

import { Community } from "@/atoms/CommunitiesAtom";
import {
  IoArrowDownCircleOutline,
  IoArrowDownCircleSharp,
  IoArrowRedoOutline,
  IoArrowUpCircleOutline,
  IoArrowUpCircleSharp,
  IoBookmarkOutline,
} from "react-icons/io5";

import useCommunityData from "@/hooks/useCommunityData";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { formatTimeToNow } from "../../../ultils/utils";
import { Post } from "../../atoms/PostAtom";
import EditorOutput from "../editor/EditorOutput";
import CommentsSection from "./comments/CommentsSection";
import Donate from "./postService/Donate";
import { message } from "antd";

// const secretPass = process.env.NEXT_PUBLIC_CRYPTO_SECRET_PASS;

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
  commentAmt: any;
  userVoteValue?: number;
  onDeletePost: (post: Post) => Promise<boolean>;
  onSelectPost?: (post: Post) => void;
  homePage?: boolean;
};
// onVote,  onClick={(event) => }
const PostOpen: React.FC<PostItemProps> = ({
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
  const [loadingImage, setLoadingImage] = useState(true);
  const [loadingDelete, setLoadingDelete] = useState(false);
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

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef: any = React.useRef();
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
      router.push(`/group/${post.groupId}`);
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

  console.log(currentVote);

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
                <Button ref={cancelRef} onClick={onClose}>
                  Thoát
                </Button>
                <Button colorScheme="red" onClick={HandleJoinGroup} ml={3}>
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
        width="55px"
        borderRadius={singlePostPage ? "0" : "3px 0px 0px 3px"}
      >
        <Flex
          position={"fixed"}
          direction="column"
          align="center"
          p={2}
          width="55px"
          borderRadius={singlePostPage ? "0" : "3px 0px 0px 3px"}
        >
          <Icon
            as={
              currentVote === 1 ? IoArrowUpCircleSharp : IoArrowUpCircleOutline
            }
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

          {/* bottom */}
          <Divider />
          <Flex
            ml={2}
            mb={0.5}
            color="gray.500"
            fontWeight={600}
            flexDirection={"column"}
          >
            <Flex
              align="center"
              p="8px 10px"
              borderRadius={4}
              _hover={{ bg: IconHoverBg }}
              cursor="pointer"
            >
              <Tooltip
                hasArrow
                label="100 bình luận"
                bg="gray.300"
                color="black"
              >
                <span>
                  <Icon as={BsChat} color={IconBg} />
                </span>
              </Tooltip>
            </Flex>
            <Flex
              align="center"
              p="8px 10px"
              borderRadius={4}
              _hover={{ bg: IconHoverBg }}
              cursor="pointer"
            >
              <Icon as={IoArrowRedoOutline} mr={2} color={IconBg} />
            </Flex>
            <Flex
              align="center"
              p="8px 10px"
              borderRadius={4}
              _hover={{ bg: IconHoverBg }}
              cursor="pointer"
            >
              <Icon as={IoBookmarkOutline} mr={2} color={IconBg} />
            </Flex>
            {user.userName == post.author ? (
              ""
            ) : (
              <Donate postId={post.postId} type={"page"}></Donate>
            )}
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
                  </>
                )}
              </Flex>
            )}
          </Flex>
        </Flex>
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
            <Text>
              Đăng bởi{" "}
              <Link className="font-bold" href={`profile/${post.author}`}>
                {post.author}
              </Link>{" "}
              {formatTimeToNow(new Date(post.time))}
            </Text>
          </Stack>
          <div>
            <EditorOutput content={post.content} />

            {/* <Comments user={user} post={post} communityId={""} ></Comments> */}

            <CommentsSection
              user={user}
              post={post}
              communityId={""}
            ></CommentsSection>
          </div>
        </Stack>
      </Flex>
    </Flex>
  );
};
export default PostOpen;
