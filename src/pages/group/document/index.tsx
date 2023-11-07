'use client'
import { motion } from "framer-motion";
import Head from "next/head";
import { useEffect, useState } from "react";

import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";

import DocumentCard from "@/components/DocumentCard/DocumentCard";
import DocumentStatic from "@/components/DocumentSelling/DocumentStatic";
import PageSingleContent from "@/components/Layout/pageSingleContent";
import useDocuments from "@/hooks/useDocument";
import { Stack } from "@chakra-ui/react";
import {
  Tab,
  TabPanel,
  Tabs,
  TabsBody,
  TabsHeader,
} from "@material-tailwind/react";
import { Skeleton } from "antd";
import { getAllStatusDocUpload } from "../../../../apis/documents";

interface DataType {
  documentName: string;
  description: string;
  cost: number;
  time: Date;
  group: string;
  message: string;
}

export default function Page() {
  const { onGetBuyList, documentStateValue } = useDocuments();

  const [docs, setDocs] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(false);

  const getAllStatusDoc = async () => {
    try {
      setLoading(true);
      const res = await getAllStatusDocUpload();
      setDocs(res.data);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Tên tài liệu",
      dataIndex: "documentName",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
    },
    {
      title: "Giá",
      dataIndex: "cost",
      render: (cost) => {
        return cost + " Xu";
      },
    },
    {
      title: "Ngày đăng",
      dataIndex: "time",
      render: (time) => {
        const date = new Date(time);
        const formattedDate = `${date.getDate()}/${
          date.getMonth() + 1
        }/${date.getFullYear()}`;
        return formattedDate;
      },
    },
    {
      title: "Nhóm",
      dataIndex: "group",
    },
    {
      title: "Trạng thái",
      dataIndex: "message",
      render: (message) => {
        let color;
        let displayMessage;

        if (message === "Accepted") {
          color = "green";
          displayMessage = "Đã duyệt";
        } else if (message === null || message === "" || message === "Accept") {
          color = "blue";
          displayMessage = "Đang chờ duyệt";
        } else {
          color = "red";
          displayMessage = "Bị cấm";
        }

        return (
          <span style={{ color, fontWeight: "bold" }}>{displayMessage}</span>
        );
      },
    },
  ];

  const onBuy = async () => {};

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
                    isBuying={true}
                    onBough={onBuy}
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

  const dataUserGellary = [
    {
      label: "Tài liệu đăng tải",
      value: "html",
      desc: (
        <Table
          columns={columns}
          dataSource={docs}
          className="w-full"
          size="large"
          rowClassName={(record) => {
            let colorClass;

            if (record.message === "Accepted") {
              colorClass = "green-row";
            } else if (
              record.message === null ||
              record.message === "" ||
              record.message === "Accept"
            ) {
              colorClass = "blue-row";
            } else {
              colorClass = "red-row";
            }

            return colorClass;
          }}
        />
      ),
    },
    {
      label: "Đã mua",
      value: "react",
      desc: renderPaymentDoc(),
    },
    {
      label: "Thống kê thu nhập",
      value: "ai",
      desc: <DocumentStatic />,
    },
  ];

  useEffect(() => {
    onGetBuyList();
    getAllStatusDoc();
  }, []);

  useEffect(() => {}, [documentStateValue]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <Head>
        <title>Camp Scholar</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/images/header.png" />
      </Head>
      <PageSingleContent>
        <Tabs id="custom-animation" value="html">
          <TabsHeader
            nonce={undefined}
            onResize={undefined}
            onResizeCapture={undefined}
          >
            {dataUserGellary.map(({ label, value }) => (
              <Tab
                className="w-[33%] min-w-[200px]"
                key={value}
                value={value}
                nonce={undefined}
                onResize={undefined}
                onResizeCapture={undefined}
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
            {dataUserGellary.map(({ value, desc }) => (
              <TabPanel key={value} value={value}>
                <Stack
                  justify={"center"}
                  gap={5}
                  flexDirection={"row"}
                  flexWrap={"wrap"}
                >
                  {" "}
                  {desc}
                </Stack>
              </TabPanel>
            ))}
          </TabsBody>
        </Tabs>
      </PageSingleContent>
    </motion.div>
  );
}
