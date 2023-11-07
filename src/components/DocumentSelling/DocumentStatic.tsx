'use client'
import type { TableColumnsType } from "antd";
import { Table } from "antd";
import React, { useEffect, useState } from "react";
import { getStaticData } from "../../../apis/user";
import Level from "../common/Level";

interface StaticType {
  key: React.Key;
  groupName: string;
  documentName: string;
  time: Date;
  documentId: number;
  revenue: number;
  billReport: BillType[];
}

interface BillType {
  key: React.Key;
  billId: number;
  times: Date;
  document: number;
  user: number;
  price: number;
}

const DocumentStatic: React.FC = () => {
  const [data, setData] = useState<StaticType[]>([]);

  const fetchSatic = async () => {
    try {
      const res = await getStaticData();
      const staticData: StaticType[] = res.data.data.map(
        (item: {
          documentId: { toString: () => any };
          billReport: { billId: { toString: () => any } }[];
        }) => ({
          ...item,
          key: item.documentId.toString(), // Gắn key bằng documentId
          billReport: item.billReport.map(
            (bill: { billId: { toString: () => any } }) => ({
              ...bill,
              key: bill.billId.toString(), // Gắn key bằng billId trong billReport
            }),
          ),
        }),
      );
      setData(staticData);
    } catch (error) {
      console.log(error);
    }
  };

  const expandedRowRender = (record: StaticType) => {
    const columns: TableColumnsType<BillType> = [
      { title: "Mã giao dịch", dataIndex: "billId", key: "billId" },
      {
        title: "Thời gian",
        dataIndex: "times",
        key: "times",
        render: (times) => {
          const date = new Date(times);
          const formattedDate = `${date.getDate()}/${
            date.getMonth() + 1
          }/${date.getFullYear()}`;
          return formattedDate;
        },
      },
      {
        title: "Đối tượng",
        dataIndex: "user",
        key: "user",
        render: (user) => {
          return <Level point={user}></Level>;
        },
      },
      {
        title: "Giá bán",
        dataIndex: "price",
        key: "price",
        render: (price) => {
          return price + " Xu";
        },
      },
    ];

    return (
      <Table
        columns={columns}
        dataSource={record.billReport}
        pagination={false}
      />
    );
  };

  const columns: TableColumnsType<StaticType> = [
    { title: "Tên tài liệu", dataIndex: "documentName", key: "documentName" },
    {
      title: "Ngày đăng tải",
      dataIndex: "time",
      key: "time",
      render: (time) => {
        const date = new Date(time);
        const formattedDate = `${date.getDate()}/${
          date.getMonth() + 1
        }/${date.getFullYear()}`;
        return formattedDate;
      },
    },
    { title: "Nhóm đăng tải", dataIndex: "groupName", key: "groupName" },
    {
      title: "Tổng thu nhập",
      dataIndex: "revenue",
      key: "revenue",
      render: (revenue) => revenue + " Xu",
    },
  ];

  useEffect(() => {
    fetchSatic();
  }, []);

  return (
    <Table
      className="w-[100%]"
      columns={columns}
      expandable={{
        expandedRowRender,
        defaultExpandedRowKeys: ["0"],
      }}
      pagination={{
        pageSize: 3, // Giới hạn số phần tử trên mỗi trang là 1
      }}
      dataSource={data}
    />
  );
};

export default DocumentStatic;
