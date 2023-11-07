"use client";
import React, { useState } from "react";

import PlaygroundEditorTheme from "@lexicalLib/theme/EditorTheme";
import PlaygroundNodes from "@nodes/PlaygroundNodes";

import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";

import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import { ClearEditorPlugin } from "@lexical/react/LexicalClearEditorPlugin";
import LexicalClickableLinkPlugin from "@lexical/react/LexicalClickableLinkPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HashtagPlugin } from "@lexical/react/LexicalHashtagPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { HorizontalRulePlugin } from "@lexical/react/LexicalHorizontalRulePlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import { TablePlugin } from "@lexical/react/LexicalTablePlugin";
import TableCellNodes from "@nodes/TableCellNodes";

import AutoEmbedPlugin from "@plugins/AutoEmbedPlugin";
import ComponentPickerPlugin from "@plugins/ComponentPickerPlugin";
import DragDropPaste from "@plugins/DragDropPastePlugin";
import EmojisPlugin from "@plugins/EmojisPlugin";
import FloatingTextFormatToolbarPlugin from "@plugins/FloatingTextFormatToolbarPlugin";
import KeywordsPlugin from "@plugins/KeywordsPlugin";
import NewMentionsPlugin from "@plugins/MentionsPlugin";
import { TableContext } from "@plugins/TablePlugin";
import ToolbarPlugin from "@plugins/ToolbarPlugin";
import Placeholder from "@ui/Placeholder";
// import CommentPlugin from '@plugins/CommentPlugin';
import AutoLinkPlugin from "@plugins/AutoLinkPlugin";
import CodeActionMenuPlugin from "@plugins/CodeActionMenuPlugin";
import CodeHighlightPlugin from "@plugins/CodeHighlightPlugin";
import DraggableBlockPlugin from "@plugins/DraggableBlockPlugin";
import EquationsPlugin from "@plugins/EquationsPlugin";
import ExcalidrawPlugin from "@plugins/ExcalidrawPlugin";
import FigmaPlugin from "@plugins/FigmaPlugin";
import FloatingLinkEditorPlugin from "@plugins/FloatingLinkEditorPlugin";
import HTMLSerializerPlugin from "@plugins/HtmlSerializerPlugin";
import ImagesPlugin from "@plugins/ImagesPlugin";
import InlineImagePlugin from "@plugins/InlineImagePlugin";
import LinkPlugin from "@plugins/LinkPlugin";
import ListMaxIndentLevelPlugin from "@plugins/ListMaxIndentLevelPlugin";
import MarkdownShortcutPlugin from "@plugins/MarkdownShortcutPlugin";
import MentionsPlugin from "@plugins/MentionsPlugin";
import PageBreakPlugin from "@plugins/PageBreakPlugin";
import PollPlugin from "@plugins/PollPlugin";
import SpeechToTextPlugin from "@plugins/SpeechToTextPlugin";
import StickyPlugin from "@plugins/StickyPlugin";
import TabFocusPlugin from "@plugins/TabFocusPlugin";
import TableActionMenuPlugin from "@plugins/TableActionMenuPlugin";
import { TablePlugin as NewTablePlugin } from "@plugins/TablePlugin";
import TwitterPlugin from "@plugins/TwitterPlugin";
import YouTubePlugin from "@plugins/YouTubePlugin";
// import AutocompletePlugin from '@plugins/AutocompletePlugin';
import TextCounterPlugin from "@plugins/TextCounterPlugin";
import dynamic from "next/dynamic";

interface IPros {
  formTitle: string;
  htmlString: string;
  setHtmlString: React.Dispatch<React.SetStateAction<string>>;
  pageName: "create_notification" | "CREATE_POST" | "any";
}

const editorConfig = {
  onError(error: Error) {
    throw error;
  },
  theme: PlaygroundEditorTheme,
  namespace: "CREATE_POST",
  nodes: [...PlaygroundNodes],
};
const cellEditorConfig = {
  namespace: "Playground",
  nodes: [...TableCellNodes],
  onError: (error: Error) => {
    throw error;
  },
  theme: PlaygroundEditorTheme,
};

function EditorLarge({
  formTitle,
  htmlString,
  setHtmlString,
  pageName,
}: IPros) {
  const [textCounting, setTextContentCounting] = useState<number>(0);

  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null);

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  const handleSubmitNotification = () => {
    console.log("POST NOTIFICATION TO SEVER!");
  };

  const handleSubmitBlog = () => {
    console.log("POST BLOG TO SEVER");
  };

  const handleSubmit = () => {
    if (pageName === "create_notification") handleSubmitNotification();
    else if (pageName === "CREATE_POST") handleSubmitBlog();
    else return;
  };

  const NoSSRTableSellResizer: any = dynamic(
    () => import("@lexicalLib/plugins/TableCellResizer"),
    { ssr: false },
  );
  const NoSSRFloatingLinkEditorPlugin: any = dynamic(
    () => import("@lexicalLib/plugins/FloatingLinkEditorPlugin"),
    { ssr: false },
  );
  const NOSSRActionsPlugin: any = dynamic(
    () => import("@lexicalLib/plugins/ActionsPlugin"),
    { ssr: false },
  );
  return (
    <div className="flex flex-col gap-[8px]">
      <div className="editor-shell">
        <LexicalComposer initialConfig={editorConfig}>
          <TableContext>
            <div className="border-2 rounded-[10px]">
              <div>{<ToolbarPlugin />}</div>
              <div className="relative">
                <HistoryPlugin />
                <DragDropPaste />
                <AutoFocusPlugin />
                <ClearEditorPlugin />
                <ComponentPickerPlugin />
                <AutoEmbedPlugin />
                <NewMentionsPlugin />
                <EmojisPlugin />
                <HashtagPlugin />
                <KeywordsPlugin />
                <SpeechToTextPlugin />
                <AutoLinkPlugin />
                <RichTextPlugin
                  contentEditable={
                    <div className="editor-scroller">
                      <div className="editor" ref={onRef}>
                        <ContentEditable className="editor-input" />
                      </div>
                    </div>
                  }
                  placeholder={
                    <Placeholder className="absolute top-[15px] left-[20px] text-[14px] text-gray-500">
                      {"Nhập nội dung bài viết..."}
                    </Placeholder>
                  }
                  ErrorBoundary={LexicalErrorBoundary}
                />

                <MarkdownShortcutPlugin />
                <ListPlugin />
                <CheckListPlugin />
                <ListMaxIndentLevelPlugin maxDepth={7} />
                <TablePlugin
                  hasCellMerge={true}
                  hasCellBackgroundColor={true}
                />
                <NoSSRTableSellResizer />
                <NewTablePlugin cellEditorConfig={cellEditorConfig}>
                  <AutoFocusPlugin />
                  <RichTextPlugin
                    contentEditable={
                      <ContentEditable className="TableNode__contentEditable" />
                    }
                    placeholder={null}
                    ErrorBoundary={LexicalErrorBoundary}
                  />
                  <MentionsPlugin />
                  <HistoryPlugin />
                  <ImagesPlugin captionsEnabled={false} />
                  <LinkPlugin />
                  <ImagesPlugin captionsEnabled={false} />
                  <LexicalClickableLinkPlugin />
                  <FloatingTextFormatToolbarPlugin />
                  <FloatingLinkEditorPlugin />
                </NewTablePlugin>

                <StickyPlugin />
                <ImagesPlugin />
                <InlineImagePlugin />
                <LinkPlugin />
                <NoSSRFloatingLinkEditorPlugin />
                <PollPlugin />
                <TwitterPlugin />
                <YouTubePlugin />
                <FigmaPlugin />
                <LexicalClickableLinkPlugin />
                <HorizontalRulePlugin />
                <EquationsPlugin />
                <ExcalidrawPlugin />
                <TabFocusPlugin />
                <TabIndentationPlugin />
                <PageBreakPlugin />
                <CodeHighlightPlugin />
                {/* <NOSSRActionsPlugin isRichText={true}/> */}
                {/* <ActionsPlugin isRichText={true}/> */}

                {floatingAnchorElem && (
                  <>
                    <>
                      <DraggableBlockPlugin anchorElem={floatingAnchorElem} />
                      <CodeActionMenuPlugin anchorElem={floatingAnchorElem} />
                      <FloatingLinkEditorPlugin
                        anchorElem={floatingAnchorElem}
                      />
                      <TableActionMenuPlugin
                        anchorElem={floatingAnchorElem}
                        cellMerge={true}
                      />
                      <FloatingTextFormatToolbarPlugin
                        anchorElem={floatingAnchorElem}
                      />
                    </>
                  </>
                )}
              </div>
              {/* <TreeViewPlugin /> */}
              <HTMLSerializerPlugin setHtmlString={setHtmlString} />
              <TextCounterPlugin
                setTextContentCounting={setTextContentCounting}
              />
            </div>
          </TableContext>
        </LexicalComposer>
      </div>

      <div className="mt-[12px] flex flex-row justify-between">
        <div>
          {/* <UnlinkButton
            textContent={"Publish notification"}
            icon={"public"}
            iconPosition={"left"}
            backgroundColor={"bg-blue-700"}
            method={() => {
              handleSubmit();
            }}
            tailwind={"text-white"}
          ></UnlinkButton> */}
        </div>
        <div>
          <p className="font-[500] select-none">
            {textCounting == 0
              ? `${textCounting + " word"}`
              : `${textCounting + " words"}`}{" "}
          </p>
        </div>
      </div>
    </div>
  );
}

export default EditorLarge;
