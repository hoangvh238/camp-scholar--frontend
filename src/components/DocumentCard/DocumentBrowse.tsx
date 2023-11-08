"use client";
import { Document } from "@/atoms/DocumentAtom";
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
import { getAllHOSTDOCByGroup } from "../../../apis/documents";
import DocumentCardBrowse from "./DocumentCardBrowse";
type Gallery = {
  groupID: number;
  groupName: string;
};

const DocumentBrowse: React.FC<Gallery> = ({ groupID, groupName }) => {
  const [docs, setDocs] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const gotoGalery = () => {
    router.push("/group/document");
  };
  const getDocumentGallery = async () => {
    setLoading(true);
    try {
      const dataDTO = await getAllHOSTDOCByGroup(groupID);
      setDocs(dataDTO.data);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const renderDocumentBrowse = () => {
    return (
      <>
        {loading ? (
          <Skeleton active />
        ) : (
          <>
            {docs?.length !== 0 ? (
              <> {docs?.map((data, index) => renderCard(data))}</>
            ) : (
              <div>Không có tài liệu nào khả dụng</div>
            )}
          </>
        )}
      </>
    );
  };

  const renderCard = (data: Document) => {
    return (
      <DocumentCardBrowse
        onResetList={() => {
          getDocumentGallery();
        }}
        document={data}
      ></DocumentCardBrowse>
    );
  };

  const data = [
    {
      label: "Đang chờ duyệt 🕒 ",
      value: "html",
      desc: renderDocumentBrowse(),
    },
  ];

  useEffect(() => {
    getDocumentGallery();
  }, []);

  return (
    <>
      <Tabs id="custom-animation" value="html">
        <TabsHeader
        >
          {data.map(({ label, value }) => (
            <Tab
              className="w-[100%] min-w-[200px] font-bold"
              key={value}
              value={value}
             
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

export default DocumentBrowse;
