"use client";

import Link from "next/link";
import { FC, useRef, useState } from "react";
import { formatTimeToNow } from "../../../ultils/utils";
import EditorOutput from "../editor/EditorOutput";

import { Post } from "@/atoms/PostAtom";
import { Flex, Icon, Image, Spinner, Stack, Text } from "@chakra-ui/react";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import { useRouter } from "next/navigation";
import * as React from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { BsChat, BsDot } from "react-icons/bs";
import { IoArrowRedoOutline, IoBookmarkOutline } from "react-icons/io5";
import { disLike, like } from "../../../apis/posts";
import PostVoteClient from "./PostVoteClient";
import { FaFreeCodeCamp } from "react-icons/fa";

interface PostProps {
  post: Post;
  votesAmt: number;
  subredditName: string;
  currentVote?: Like;
  commentAmt: number;
  user: string;
}

type Like = {
  auth: string;
  likeId: number;
  status: number;
  time: Date;
};

type Comment = {
  commentId: number;
  postId: number;
  commentParentId: number;
  content: string;
  time: Date;
  author: string;
  reports: [];
  likes: Like[];
};

const Post: FC<PostProps> = ({
  post,
  votesAmt: _votesAmt,
  currentVote: _currentVote,
  subredditName,
  commentAmt,
  user,
}) => {
  const [votesAmt, setVotesAmt] = useState<number>(_votesAmt);
  const [currentVote, setCurrentVote] = useState<number | undefined>(
    _currentVote?.status,
  );
  const [loadingDelete, setLoadingDelete] = useState(false);
  const singlePostView = true; // function not passed to [pid]
  const pRef = useRef<HTMLParagraphElement>(null);
  const router = useRouter();

  const [hover, setHover] = useState(false);
  const [isReading, setIsReading] = useState(false);

  const [checked, setChecked] = React.useState(false);

  const handleChange = () => {
    setChecked((prev) => !prev);
  };

  const handleSetAmt = (value: number) => {
    setVotesAmt(value);
  };

  const handleVoting = (vote: number) => {
    setCurrentVote(vote);
  };

  React.useEffect(() => {
    setCurrentVote(currentVote);
  }, [currentVote]);

  const checking = () => {
    if (!user) {
      router.push("/sign-in");
      return false;
    }
    return true;
  };
  const handleLike = async () => {
    if (!checking()) return;
    await like(post.postId, user);

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

  const handleDisLike = async () => {
    if (!checking()) return;
    await disLike(post.postId, user);

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

  return (
    <div className="rounded-md bg-white shadow">
      <Flex
        border="1px solid"
        bg="white"
        borderColor={singlePostView ? "white" : "gray.300"}
        borderRadius={singlePostView ? "4px 4px 4px 4px" : 4}
        cursor={singlePostView ? "unset" : "pointer"}
        _hover={{ borderColor: singlePostView ? "none" : "gray.500" }}
        // onClick={() => }
      >
        <Flex
          direction="column"
          align="center"
          bg={singlePostView ? "none" : "gray.100"}
          p={0}
          width="56px"
        >
          <div className="w-[100%] h-[100%] justify-center bg-gray-100	rounded-[4px] ">
            <PostVoteClient
              currentVote={currentVote}
              votesAmt={votesAmt}
              handleLike={handleLike}
              handleDisLike={handleDisLike}
            />
          </div>
        </Flex>
        <Flex direction="column" width="100%">
          <Stack spacing={1} p="10px 10px">
            {post.time && (
              <Stack
                direction="row"
                spacing={0.6}
                align="center"
                fontSize="9pt"
              >
                {true && (
                  <>
                    {null ? ( //post.communityImageURL
                      <Image
                        borderRadius="full"
                        boxSize="18px"
                        src={"alt"}
                        mr={2}
                      />
                    ) : (
                      <Icon
                        as={FaFreeCodeCamp}
                        fontSize={18}
                        mr={1}
                        color="blue.500"
                      />
                    )}
                    <Link href={`group/${post.groupName}`}>
                      <Text
                        fontWeight={700}
                        _hover={{ textDecoration: "underline" }}
                        onClick={(event) => event.stopPropagation()}
                      >{`${post.groupName}`}</Text>
                    </Link>
                    <Icon as={BsDot} color="gray.500" fontSize={8} />
                  </>
                )}
                <Text color="gray.500">
                  Posted by {post.author} {formatTimeToNow(new Date(post.time))}
                </Text>
              </Stack>
            )}
            <div
              className="relative pt-[20px] text-sm  w-full overflow-clip"
              ref={pRef}
              onMouseMove={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
            >
              <div
                style={
                  !isReading ? { maxHeight: "500px" } : { maxHeight: "10000px" }
                }
              >
                <EditorOutput content={post.content} />
              </div>
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
                            <KeyboardDoubleArrowDownIcon
                              style={
                                isReading
                                  ? { transform: "rotate(180deg)" }
                                  : { transform: "rotate(0deg)" }
                              }
                              className="absolute bottom-0"
                            />
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
              _hover={{ bg: "gray.200" }}
              cursor="pointer"
            >
              <Icon as={BsChat} mr={2} />
              <Text fontSize="9pt">{20000}</Text>
            </Flex>
            <Flex
              align="center"
              p="8px 10px"
              borderRadius={4}
              _hover={{ bg: "gray.200" }}
              cursor="pointer"
            >
              <Icon as={IoArrowRedoOutline} mr={2} />
              <Text fontSize="9pt">Share</Text>
            </Flex>
            <Flex
              align="center"
              p="8px 10px"
              borderRadius={4}
              _hover={{ bg: "gray.200" }}
              cursor="pointer"
            >
              <Icon as={IoBookmarkOutline} mr={2} />
              <Text fontSize="9pt">Save</Text>
            </Flex>
            {true && (
              <Flex
                align="center"
                p="8px 10px"
                borderRadius={4}
                _hover={{ bg: "gray.200" }}
                cursor="pointer"
                // onClick={handleDelete}
              >
                {loadingDelete ? (
                  <Spinner size="sm" />
                ) : (
                  <>
                    <Icon as={AiOutlineDelete} mr={2} />
                    <Text fontSize="9pt">Delete</Text>
                  </>
                )}
              </Flex>
            )}
          </Flex>
        </Flex>
      </Flex>
    </div>
  );
};
export default Post;
