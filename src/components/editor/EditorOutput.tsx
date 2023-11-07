"use client";
import { FC } from "react";

interface EditorOutputProps {
  content: any;
}

const EditorOutput: FC<EditorOutputProps> = ({ content }) => {
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: content }}></div>
    </>
  );
};

export default EditorOutput;
