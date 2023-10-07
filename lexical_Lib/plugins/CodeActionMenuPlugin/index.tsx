"use client"
import './index.css';
import dynamic from 'next/dynamic';

import {
  $isCodeNode,
  CodeNode,
  getLanguageFriendlyName,
  normalizeCodeLang,
} from '@lexical/code';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {$getNearestNodeFromDOMNode} from 'lexical';
import {useEffect, useRef, useState} from 'react';
import * as React from 'react';
import {createPortal} from 'react-dom';

import {CopyButton} from './components/CopyButton';
import {canBePrettier, PrettierButton} from './components/PrettierButton';
import {useDebounce} from './utils';



const DynamicCodeActionMenuContainer = dynamic(() => import('./components/CodeActionMenuContainer'), {
  ssr: false,
});

export default function CodeActionMenuPlugin({
  anchorElem = (typeof window !== 'undefined' ? document.body : null),
}: {
  anchorElem?: HTMLElement | null;
}): React.ReactPortal | null {
  useEffect(() => {
    // Chỉ chạy khi mã đang chạy trên máy khách (client-side).
    if (typeof window !== 'undefined') {
      // Tạo portal ở đây khi trang đã hydrate.
      anchorElem !== null && createPortal(
        <DynamicCodeActionMenuContainer anchorElem={anchorElem} />,
        anchorElem
      );
    }
  }, [anchorElem]);

  return null;
}




