"use client";

import { Comment, Like } from "@/atoms/PostAtom";
import { useOnClickOutside } from "@/hooks/use-on-click-outside";
import usePosts from "@/hooks/usePosts";
import { RootState } from "@/redux/store";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Avatar,
  Box,
  Button,
  Flex,
  Icon,
  Link,
  Text,
  Textarea,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { MessageSquare, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { FC, useRef, useState } from "react";
import {
  IoArrowDownCircleOutline,
  IoArrowDownCircleSharp,
  IoArrowUpCircleOutline,
  IoArrowUpCircleSharp,
} from "react-icons/io5";
import { useSelector } from "react-redux";
import { formatTimeToNow } from "../../../../ultils/utils";

type CommentWithReplies = Comment & {
  replies?: Comment[];
};

type UserBase = {
  userId: number;
  userName: string;
  role: string;
};

interface PostCommentProps {
  updateComments: () => Promise<void>;
  comment: CommentWithReplies;
  _votesAmt: number;
  _currentVote: Like | undefined;
  postId: number;
  sortByLike : any
}

const PostComment: FC<PostCommentProps> = ({
  updateComments,
  comment,
  _votesAmt,
  _currentVote,
  sortByLike,
  postId,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef: any = React.useRef();
  const user = useSelector((state: RootState) => state.userInfor.currentUser);
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const commentRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState<string>(`@${comment.author} `);
  const router = useRouter();
  const voteIconBg = useColorModeValue("gray.400", "#CBD5E0");
  const [votesAmt, setVotesAmt] = useState<number>(_votesAmt);
  const [currentVote, setCurrentVote] = useState<number | undefined>(
    _currentVote?.status,
  );

  useOnClickOutside(commentRef, () => {
    handleDiscardRep();
  });

  const { onVoteComment, onComment, onDeleteComment } = usePosts();

  const handleLike = async (event: React.MouseEvent<Element, MouseEvent>) => {
    if (!(await onVoteComment(event, comment.commentId, 1))) return;
   
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

    sortByLike();
  };

  const handleDisLike = async (
    event: React.MouseEvent<Element, MouseEvent>,
  ) => {
    if (!(await onVoteComment(event, comment.commentId, -1))) return;
    
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
    sortByLike();
  };

  const handleComment = async () => {
    const isChild = comment.commentParentId != 0;
    await onComment(
      input,
      comment.postId,
      isReplying ? (isChild ? comment.commentParentId : comment.commentId) : 0,
    );
    await updateComments();
    HandleOkeDiscard();
  };

  const handleDeleteComment = async () => {
    await onDeleteComment(comment.commentId);
    await updateComments();
  };

  const handleSetAmt = (value: number) => {
    setVotesAmt(value);
  };

  const handleVoting = (vote: number) => {
    setCurrentVote(vote);
  };

  const handleDiscardRep = () => {
    if (input.trim() !== `@${comment.author}`) onOpen();
    else HandleOkeDiscard();
  };

  const HandleOkeDiscard = () => {
    setIsReplying(false);
    setInput(`@${comment.author} `);
    onClose();
  };

  return (
    <div ref={commentRef} className="flex flex-col">
      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>Hủy bình luận?</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>Bạn có muốn hủy bình luận ?</AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Tiếp tục
            </Button>
            <Button colorScheme="red" ml={3} onClick={HandleOkeDiscard}>
              Từ bỏ
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex items-center">
        <Box mr={2}>
          <Avatar src={"/"} size="sm" name={comment.author} />
        </Box>
        <div className=" flex items-center gap-x-2">
          <Link href={`/profile/${comment.author}`}>
            {" "}
            <Text fontWeight={"semibold"}>{comment.author}</Text>
          </Link>
          <p className="max-h-40 truncate text-xs text-zinc-500"></p>
          <Text fontWeight={"light"} fontSize={12}>
            {" "}
            {formatTimeToNow(new Date(comment.time))}
          </Text>
        </div>
      </div>

      <Text fontWeight="normal" fontSize={14} mt={3}>
        {comment.content.split(/(@\S+)/g).map((text, index) =>
          text.startsWith("@") ? (
            <span key={index} style={{ color: "steelblue" }}>
              {text}
            </span>
          ) : (
            text
          ),
        )}
      </Text>

      <p className="text-sm text-zinc-900 mt-2"></p>
      <div className="flex ">
        <Flex
          direction="row"
          align="center"
          gap={"1"}
          pt={2}
          pb={2}
          width="70px"
        >
          <Icon
            as={
              currentVote === 1 ? IoArrowUpCircleSharp : IoArrowUpCircleOutline
            }
            color={currentVote === 1 ? "brand.100" : voteIconBg}
            fontSize={22}
            onClick={(event: any) => handleLike(event)}
            cursor="pointer"
          />
          <Text fontSize="11pt" fontWeight={"bold"}>
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
        <div className="flex items-center gap-2">
          <Button
            onClick={() => {
              if (!user.userId) return router.push("/sign-in");
              setIsReplying(true);
            }}
            variant="outline"
            size="xs"
          >
            <MessageSquare className="h-4 w-4 mr-1.5" />
            Phản hồi
          </Button>
          {user.userName == comment.author && (
            <Button
              onClick={() => {
                handleDeleteComment();
              }}
              variant="outline"
              size="xs"
              color={"red.500"}
              borderColor={"red.500"}
            >
              <Trash2 className="h-4 w-4 mr-1.5" />
              Xóa
            </Button>
          )}
        </div>
      </div>

      {isReplying ? (
        <div className="grid w-full gap-1.5">
          <div className="mt-2">
            <Textarea
              onFocus={(e) =>
                e.currentTarget.setSelectionRange(
                  e.currentTarget.value.length,
                  e.currentTarget.value.length,
                )
              }
              autoFocus
              id="comment"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={1}
              placeholder="Bạn đang nghĩ gì ?"
            />

            <div className="mt-2 flex justify-end gap-2">
              <Button
                tabIndex={-1}
                variant="subtle"
                onClick={() => HandleOkeDiscard()}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (!input) return;
                  handleComment();
                }}
              >
                Post
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default PostComment;
