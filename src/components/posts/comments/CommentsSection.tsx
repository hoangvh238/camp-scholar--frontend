
// import CreateComment from './CreateComment'
// import PostComment from './comments/PostComment'
import { Comment, Post } from "@/atoms/PostAtom";
import usePosts from "@/hooks/usePosts";
import { AbsoluteCenter, Box, Button, Divider, Heading, Textarea } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { VscSend } from "react-icons/vsc";
import { getAllComment } from "../../../../apis/comments";
import PostComment from "./PostComment";
type CommentWithReplies = Comment & {
  replies?: Comment[];

};

type UserBase = {
  userId: number,
  userName: string,
  role: string,
};

type CommentsProps = {
  user: UserBase;
  post: Post;
  communityId: string;
};

const CommentsSection: React.FC<CommentsProps> = ({
  user,
  post,
  communityId,
}) => {
  const [comments, setComments] = useState<CommentWithReplies[]>(post.comments);
 
  const [updateTrigger, setUpdateTrigger] = useState(false);
  const { onComment } = usePosts();
  const [input, setInput] = useState<string>("");
  const addRepliesToComments = (comments: CommentWithReplies[]) => {
    return comments.map((comment) => {
      const replies = comments.filter((c) => c.commentParentId === comment.commentId);
      if (replies.length > 0) {
        comment.replies = replies;
      }
      return comment;
    });
  };

  const sortComment = () =>{
     setComments(comments.sort((a, b) => {
      const likesA = a.likes.reduce((acc, vote) => {
        if (vote.status === 1) return acc + 1;
        if (vote.status === -1) return acc - 1;
        return acc;
      }, 0);
      const likesB = b.likes.reduce((acc, vote) => {
        if (vote.status === 1) return acc + 1;
        if (vote.status === -1) return acc - 1;
        return acc;
      }, 0);
  
      // Sort in descending order
      return likesB - likesA;
    }))
  }

  const sortCommentExits = (comments:Comment[]) =>{
    setComments(comments.sort((a, b) => {
     const likesA = a.likes.reduce((acc, vote) => {
       if (vote.status === 1) return acc + 1;
       if (vote.status === -1) return acc - 1;
       return acc;
     }, 0);
     const likesB = b.likes.reduce((acc, vote) => {
       if (vote.status === 1) return acc + 1;
       if (vote.status === -1) return acc - 1;
       return acc;
     }, 0);
 
     // Sort in descending order
     return likesB - likesA;
   }))
 }

  const handleComment = async () => {
    await onComment(input, post.postId,0);
    await updateComments();
  }

  const updateComments = async () => {
    setInput("");

    try {
      const newCommentsResponse = await getAllComment(post.postId);
      const newComments = newCommentsResponse.data.map((commentData: { commentChildren: never[]; }) => {
        const replies = commentData.commentChildren || [];
        return {
          ...commentData,
          replies,
        };
      });
      setUpdateTrigger(true);
      setComments(newComments);
    } catch (error) {
      console.error("Error updating comments", error);
    }
  };

  const getPostComments = async () => {

    setComments(post.comments);
    addRepliesToComments(post.comments);

  };

  useEffect(() => {

    getPostComments();
    sortComment();

  }, []);



 

  // comments.sort((a, b) => {
  //   const repliesA = a.replies ? a.replies.length : 0;
  //   const repliesB = b.replies ? b.replies.length : 0;
  //   return repliesB - repliesA;
  // });

  // comments.slice().sort((a, b) => b.time.getTime() - a.time.getTime());



  return (
    <div className='flex flex-col gap-y-4 mt-4'>
      <hr className='w-full h-px ' />

      <Heading as='h2' size='lg'>Bình luận</Heading>

      <Textarea
        onFocus={(e) =>
          e.currentTarget.setSelectionRange(
            e.currentTarget.value.length,
            e.currentTarget.value.length
          )
        }
        id='comment'
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={1}
        placeholder='Bạn đang nghĩ gì ?'
      />
      <div className="flex justify-end">
        <Button leftIcon={<VscSend />} colorScheme='teal' variant='solid' onClick={handleComment}>
          Gửi
        </Button>
      </div>

      <div className='flex flex-col gap-y-6'>

        <div className=" text-center ">
          {comments.length == 0 ? <Box position='relative' padding='10'>
            <Divider />
            <AbsoluteCenter bg='white' px='4'>
              Không có bình luận nào
            </AbsoluteCenter>
          </Box>
            : ""}
        </div>
        {comments.filter((comment) => !comment.commentParentId).map((topLevelComment) => {
          const topLevelCommentVotesAmt = topLevelComment.likes.reduce(
            (acc, vote) => {
              if (vote.status === 1) return acc + 1
              if (vote.status === -1) return acc - 1
              return acc
            },
            0
          )

          const topLevelCommentVote = topLevelComment.likes.find(
            (vote) => vote.auth === user.userName
          )

          return (
            <div key={topLevelComment.commentId} className='flex flex-col'>
              <div className='mb-2'>
                <PostComment
                sortByLike={()=>{sortComment()}}
                  updateComments={updateComments}
                  comment={topLevelComment}
                  _currentVote={topLevelCommentVote}
                  _votesAmt={topLevelCommentVotesAmt}
                  postId={topLevelComment.commentId}
                />
              </div>

              {/* Render replies */}
              {topLevelComment.replies?.sort((a, b) => b.likes.length - a.likes.length).map((reply) => {
                const replyVotesAmt = reply.likes.reduce((acc, vote) => {
                  if (vote.status === 1) return acc + 1
                  if (vote.status === -1) return acc - 1
                  return acc
                }, 0)

                const replyVote = reply.likes.find(
                  (vote) => vote.auth === user.userName
                )

                return (
                  <div
                    key={reply.commentId}
                    className='ml-2 py-2 pl-4 border-l-2 border-zinc-200'>
                    <PostComment
                    sortByLike={()=>{sortComment()}}
                      updateComments={updateComments}
                      comment={reply}
                      _currentVote={replyVote}
                      _votesAmt={replyVotesAmt}
                      postId={reply.commentId}
                    />
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default CommentsSection
