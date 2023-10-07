'use client'

// import { useCustomToasts } from '@/hooks/use-custom-toasts'
// import { PostVoteRequest } from '@/lib/validators/vote'
// import { usePrevious } from '@mantine/hooks'
// import { VoteType } from '@prisma/client'
// import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import React, { useEffect, useState } from 'react'
import { Button } from '@chakra-ui/react';
import { ArrowBigDown, ArrowBigUp } from 'lucide-react';
import { like } from '../../../apis/posts'
import { disLike } from '../../../apis/posts'
import { cn } from '../../../ultils/utils';

interface PostVoteClientProps {
  currentVote : number | undefined,
  votesAmt : number | 0,
  handleLike : () => void,
  handleDisLike : () => void 

}

const PostVoteClient = ({
  votesAmt,
  currentVote,
  handleDisLike,
  handleLike
}: PostVoteClientProps) => {
  // const { loginToast } = useCustomToasts()

  // const prevVote = usePrevious(currentVote);
  // const userName = useSelector((state: RootState) => state.userInfor.currentUser.userName);

  

    return (
      <div className='flex flex-col gap-4 sm:gap-0 pr-6 sm:w-20 pb-4 sm:pb-0'>
        {/* upvote */}
        <Button
          onClick={() => handleLike()}
          size='sm'
          variant='ghost'
          aria-label='upvote'>
          <ArrowBigUp
            className={cn('h-5 w-5 text-zinc-700 ', {
              'text-emerald-500 fill-emerald-500': currentVote === 1,
            })}
          />
        </Button>

        {/* score */}
        <p className={cn('text-center py-2 font-bold text-sm text-zinc-900', {
  'text-emerald-500': currentVote === 1,
  'text-red-500': currentVote === -1,
  ' text-emerald-500': currentVote === 0 && votesAmt > 0,
  ' text-red-500': currentVote === 0 && votesAmt < 0,
})}>
  {votesAmt}
</p>


        {/* downvote */}
        <Button
          onClick={() => handleDisLike()}
          size='sm'
          className={cn({
            'text-emerald-500': currentVote === -1,
          })}
          variant='ghost'
          aria-label='downvote'>
          <ArrowBigDown
            className={cn('h-5 w-5 text-zinc-700', {
              'text-red-500 fill-red-500': currentVote === -1,
            })}
          />
        </Button>
      </div>
    )
  }
  

  


export default PostVoteClient
