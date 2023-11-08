
import DocViewer from "@cyntler/react-doc-viewer";
import { getCookie } from "cookies-next";
import React, { useState } from "react";

type docReview = {
  docId: number;
  isBuying: boolean;
};
const DocumentReview = ({ docId, isBuying }: docReview) => {
  const headers = {
    Authorization: `Bearer ${getCookie("token")}`,
  };
  const docs = [
    {
      uri: isBuying
        ? ` http://localhost:8080/doc/full/${docId}`
        : ` http://localhost:8080/doc/preview/${docId}`,
    }, // Remote file
  ];
  const [activeDocument, setActiveDocument] = useState(docs[0]);
  const handleDocumentChange = (
    document: React.SetStateAction<{ uri: string }>,
  ) => {
    setActiveDocument(document);
  };

  return (
    <div className="document-review">
      {!isBuying ? (
        <style>
          {`
            #pdf-controls {
              display: none !important;
            },
           
          `}
        </style>
      ) : (
        ""
      )}

      <DocViewer
        documents={docs}
        prefetchMethod="GET"
        onDocumentChange={handleDocumentChange}
        requestHeaders={headers}
        config={{
          header: {
            disableHeader: true,
            disableFileName: true,
            retainURLParams: true,
          },
          csvDelimiter: ",", // "," as default,
          pdfZoom: {
            defaultZoom: 1.1, // 1 as default,
            zoomJump: 0.2, // 0.1 as default,
          },
          pdfVerticalScrollByDefault: true, // false as default,
        }}
      />
    </div>
  );
};

export default DocumentReview;
