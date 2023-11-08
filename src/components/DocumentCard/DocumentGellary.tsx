
import { Document } from "@/atoms/DocumentAtom";
import useDocuments from "@/hooks/useDocument";
import { Stack } from "@chakra-ui/react";
import {
  Tab,
  TabPanel,
  Tabs,
  TabsBody,
  TabsHeader,
} from "../common/common";
import { Skeleton } from "antd";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { getAllDOCByGroup } from "../../../apis/documents";
import DocumentUpload from "../DocumentSelling/DocumentUpload";
import DocumentCard from "./DocumentCard";
type Gallery = {
  groupID: number;
  groupName: string;
};

const DocumentGallery: React.FC<Gallery> = ({ groupID, groupName }) => {
  const [docs, setDocs] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const { onBough, onGetBuyList, documentStateValue } = useDocuments();
  const router = useRouter();

  const isBuying = (docxID: number) => {
    const document = documentStateValue?.documents?.find(
      (value) => value.documentId === docxID,
    );
    console.log("Document ID:", docxID);
    console.log("Is Buying:", !!document); // Log whether it's buying or not
    return !!document;
  };

  const gotoGalery = () => {
    router.push("/group/document");
  };
  const getDocumentGallery = async () => {
    setLoading(true);
    try {
      const dataDTO = await getAllDOCByGroup(groupID);
      setDocs(dataDTO.data);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const renderUpload = () => {
    return <DocumentUpload groupID={groupID}></DocumentUpload>;
  };

  const renderBuyGallery = () => {
    return (
      <>
        {loading ? (
          <Skeleton active />
        ) : (
          <>
            {docs.length !== 0 ? (
              <>
                {" "}
                {docs.map((data, index) =>
                  renderCard(data, index, isBuying(data.documentId)),
                )}
              </>
            ) : (
              <div>Không có tài liệu nào khả dụng</div>
            )}
          </>
        )}
      </>
    );
  };

  const renderCard = (data: Document, index: number, isBuying: boolean) => {
    return isBuying ? (
      <></>
    ) : (
      <DocumentCard
        isBuying={isBuying}
        onBough={onBough}
        document={data}
        buyList={documentStateValue.documents}
        key={index}
      ></DocumentCard>
    );
  };
  const renderPaymentDoc = () => {
    return (
      <>
        {loading ? (
          <Skeleton active />
        ) : (
          <>
            {documentStateValue?.documents?.length !== 0 ? (
              <>
                {" "}
                {documentStateValue?.documents?.map((data, index) => (
                  <DocumentCard
                    isBuying={isBuying(data.documentId)}
                    onBough={onBough}
                    document={data}
                    buyList={documentStateValue.documents}
                    key={index}
                  ></DocumentCard>
                ))}
              </>
            ) : (
              <div>Không có tài liệu nào khả dụng</div>
            )}
          </>
        )}
      </>
    );
  };



  const data = [
    {
      label: "Thư viện 📚",
      value: "html",
      desc: renderBuyGallery(),
    },
    {
      label: "Đăng tải 📤",
      value: "react",
      desc: renderUpload(),
    },
    {
      label: "Tài liệu của tôi 📑",
      value: "user",
      desc: "",
    },
  ];

  useEffect(() => {
    getDocumentGallery();
    onGetBuyList();
  }, []);

  useEffect(() => {
    console.log("da mua" + documentStateValue.documents);
  }, [documentStateValue]);

  return (
    <>
      <Tabs id="custom-animation" value="html">
        <TabsHeader
          nonce={undefined}
          onResize={undefined}
          onResizeCapture={undefined}
        >
          {data.map(({ label, value }) => (
            <Tab
              className="w-[33%] min-w-[200px] font-bold"
              key={value}
              value={value}
              nonce={undefined}
              onResize={undefined}
              onResizeCapture={undefined}
              onClick={
                value === "user"
                  ? () => {
                      gotoGalery();
                    }
                  : () => {}
              }
            >
              {label}
            </Tab>
          ))}
        </TabsHeader>
        <TabsBody
          animate={{
            initial: { y: 250 },
            mount: { y: 0 },
            unmount: { y: 250 },
          }}
          nonce={undefined}
          onResize={undefined}
          onResizeCapture={undefined}
        >
          {data.map(({ value, desc }) => (
            <TabPanel key={value} value={value}>
              <Stack
                justify={"center"}
                gap={5}
                flexDirection={"row"}
                flexWrap={"wrap"}
              >
                {desc}
              </Stack>
            </TabPanel>
          ))}
        </TabsBody>
      </Tabs>
    </>
  );
};

export default DocumentGallery;
