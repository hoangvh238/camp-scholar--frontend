'use client'
import React from 'react'
import { FC } from 'react'
import dynamic from 'next/dynamic'
import { encode } from 'html-entities';




interface EditorOutputProps {
  content: any
}


const EditorOutput: FC<EditorOutputProps> = ({ content }) => {
  return (
    <>
     <div dangerouslySetInnerHTML={{ __html: content }} ></div>
    </> 
  )
}

export default EditorOutput
