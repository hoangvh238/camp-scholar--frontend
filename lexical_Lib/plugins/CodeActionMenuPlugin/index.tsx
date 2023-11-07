"use client"
import dynamic from 'next/dynamic';
import './index.module.css';

import * as React from 'react';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';




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




