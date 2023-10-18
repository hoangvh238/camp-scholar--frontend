import {
  Alert,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertIcon,
  Badge,
  Button,
  Collapse,
  Flex,
  Icon,
  Image,
  Skeleton,
  Spinner,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import CryptoJS from "crypto-js";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { BsChat, BsDot } from "react-icons/bs";
import { LiaDonateSolid } from "react-icons/lia";
import { HiOutlineUserGroup } from "react-icons/hi2";

import {
  IoArrowDownCircleOutline,
  IoArrowDownCircleSharp,
  IoArrowRedoOutline,
  IoArrowUpCircleOutline,
  IoArrowUpCircleSharp,
  IoBookmarkOutline,
} from "react-icons/io5";
import { Community } from "@/atoms/CommunitiesAtom";

import { Post } from "../../atoms/PostAtom";
import PostVoteClient from "../Post/PostVoteClient";
import EditorOutput from "../editor/EditorOutput";
import { cn, formatTimeToNow } from "../../../ultils/utils";
import { Bold } from "lucide-react";
import useCommunityData from "@/hooks/useCommunityData";
import Donate from "./postService/Donate";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

type PostItemProps = {
  post: Post;
  userIsCreator: boolean;
  onVote: (
    event: React.MouseEvent<Element, MouseEvent>,
    post: number,
    vote: number,
    communityId: string
  ) => Promise<boolean>;
  votesAmt: number
  commentAmt: number
  userVoteValue?: number;
  onDeletePost: (post: Post) => Promise<boolean>;
  onSelectPost?: (post: Post) => void;
  homePage?: boolean;
};
// onVote,  onClick={(event) => }
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
  const [loadingImage, setLoadingImage] = useState(true);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [error, setError] = useState(false);
  const singlePostPage = !onSelectPost;
  const [votesAmt, setVotesAmt] = useState<number>(_votesAmt)
  const [currentVote, setCurrentVote] = useState<number | undefined>(userVoteValue)
  const singlePostView = true; // function not passed to [pid]
  const pRef = useRef<HTMLParagraphElement>(null);
  const router = useRouter();
  const user = useSelector((state: RootState) => state.userInfor.currentUser)

  const { communityStateValue, onJoinOrCommunity, loading } =
    useCommunityData();


  const [hover, setHover] = useState(false);
  const [isReading, setIsReading] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef<FocusableElement | null>(null);

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
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();
    setLoadingDelete(true);
    try {
      const success = await onDeletePost(post);

      if (!success) {
        throw new Error("Failed to Delete Post");
      }

      console.log("Post was Successfully Deleted");

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
    if (votesAmt < 0) return voteIconBgDown
    return voteIconBg
  }

  const isJoined = () => {
    return communityStateValue.mySnippets.find(
      (item) => item.groupId === post?.groupId
    );
  }

  const HandleJoinGroup = () => {
    const gr: Community = {
      groupId: post.groupId,
      groupName: "",
      host: "",
      hashtag: "",
      description: "",
      imageURLGAvatar: "",
      imageUrlGCover: "",
      category: "",
      timeCreate: new Date
    }
    onJoinOrCommunity(gr, false);
    onClose();
  }

  const handleLike = async (event: React.MouseEvent<Element, MouseEvent>) => {


    if (!await onVote(event, post.postId, 1, post.groupName)) return;
    if (!isJoined()) { onOpen(); return };

    if (currentVote === 1) {
      handleSetAmt(votesAmt - 1);
      handleVoting(0);
    }
    else if (currentVote === -1) {
      handleSetAmt(votesAmt + 2);
      handleVoting(1);
    }
    else {
      handleSetAmt(votesAmt + 1);
      handleVoting(1);
    }
  }

  const handleDisLike = async (event: React.MouseEvent<Element, MouseEvent>) => {

    if (!await onVote(event, post.postId, -1, post.groupName)) return;
    if (!isJoined()) { onOpen(); return };
    if (currentVote === 1) {
      handleSetAmt(votesAmt - 2);
      handleVoting(-1);
    }
    else if (currentVote === -1) {
      handleSetAmt(votesAmt + 1);
      handleVoting(0);
    }
    else {
      handleSetAmt(votesAmt - 1);
      handleVoting(-1);
    }

  }

  const handleSetAmt = (value: number) => {
    setVotesAmt(value);
  }

  const handleVoting = (vote: number) => {
    setCurrentVote(vote);
  }

  console.log("length is" + post.content?.length);


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
        {/* <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Xóa bài viết ?
            </AlertDialogHeader>

            <AlertDialogBody>
              Bạn có chắc chữ ? Dữ liệu sẽ mất và không thể khôi phục 
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Thoát
              </Button>
              <Button colorScheme='red' onClick={onClose} ml={3}>
                Chấp nhận
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog> */}


        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                Tham gia ngay
              </AlertDialogHeader>

              <AlertDialogBody>
                Bạn nó muốn tham gia nhóm : {post.groupName}
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} bg={"blue.200"} onClick={onClose}>
                  Thoát
                </Button>
                <Button colorScheme='red' bg={"orange.500"} onClick={HandleJoinGroup} ml={3}>
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
      </Flex>
      <Flex direction="column" width="100%" >
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
                  <Image
                    src={"/"}
                    borderRadius="full"
                    boxSize="18px"
                    mr={2}
                  />
                ) : (
                  <Icon as={HiOutlineUserGroup} fontSize="18px" color="blue.500" />
                )}

                <Link href={`group/${post.groupId}`}>
                  <Text
                    fontWeight={700}
                    _hover={{ textDecoration: "underline" }}
                    onClick={(event) => event.stopPropagation}
                  >{`Group/${post.groupName}`}</Text>
                </Link>
                <Icon as={BsDot} color="gray.500" fontSize={8} />
              </>
            )}
            <Text className="pr-1">Posted by</Text>
            <Stack direction='row' className="pr-1"> <Badge colorScheme='yellow'>Chuyên gia</Badge></Stack>
            <Text>
             <Link className="font-bold" href={`profile/${post.author}`}>{post.author}</Link>{" "}



            </Text>
            <Icon as={BsDot} color="gray.500" fontSize={8} />
            <Text>  {formatTimeToNow(new Date(post.time))}</Text>

          </Stack>
          <div onMouseMove={() => setIsReading(true)} onMouseLeave={() => setIsReading(false)} onClick={() => onSelectPost && onSelectPost(post)}>
            <Collapse startingHeight={post.content?.length < 600 ? 50 : 400} in={isReading} >

              <EditorOutput content={post.content} />
            </Collapse>
          </div>

          <div className='relative pt-[20px] text-sm  w-full overflow-clip' ref={pRef} onMouseMove={() => setIsReading(true)} onMouseLeave={() => setIsReading(false)} onClick={() => onSelectPost && onSelectPost(post)}>
            <div style={!isReading ? { maxHeight: "200px" } : { maxHeight: "10000px" }}>

            </div>
            {pRef.current ? (
              pRef.current.clientHeight >= 500 ? (
                // blur bottom if content is too long
                <div className='absolute bottom-0 left-0 w-full'>
                  <div className='absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-white to-white-10 '
                    onClick={() => setIsReading(!isReading)}
                  >

                    <div className='absolute bottom-0 left-0 w-full'>
                      <div className='flex content-center justify-center w-full'>
                        {hover ? (
                          <Image
                            className='absolute bottom-0'
                            style={isReading ? { transform: "rotate(180deg)" } : { transform: "rotate(0deg)" }}
                            src={""}
                            alt=''
                          />
                        ) : (
                          // <KeyboardDoubleArrowDownIcon
                          //   style={isReading ? { transform: "rotate(180deg)" } : { transform: "rotate(0deg)" }}
                          //   className='absolute bottom-0'
                          // />
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
          {user?.userName == post.author ? "" : <Donate postId={post.postId} type={"post"}></Donate>}
          <Flex
            align="center"
            p="8px 10px"
            borderRadius={4}
            _hover={{ bg: IconHoverBg }}
            cursor="pointer"
          >
            <Icon as={IoBookmarkOutline} mr={2} color={IconBg} />
            <Text fontSize="9pt" color={IconBg}>
              Save
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
        </Flex>
      </Flex>
    </Flex>
  );
};
export default PostItem;
