import { RootState } from "@/redux/store";
import { Badge } from "@chakra-ui/react";
import { Button, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getGroupMember, kickMember } from "../../../apis/groups";
import Level from "../common/Level";

interface DataType {
  key: React.Key;
  userId: number;
  userName: string;
  activityPoint: number;
  isLocked: boolean;
}

type MemberProps = {
  groupID: number;
  groupHost: string;
};

const CommunityMember: React.FC<MemberProps> = ({ groupID, groupHost }) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedUserNames, setSelectedUserNames] = useState<string[]>([]);
  const user = useSelector((state: RootState) => state.userInfor.currentUser);
  const [loading, setLoading] = useState(false);
  const [memeber, setMemeber] = useState<DataType[]>([]);
  const start = () => {
    setLoading(true);
    setTimeout(() => {
      setSelectedRowKeys([]);
      setSelectedUserNames([]);
      setLoading(false);
    }, 1000);
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Tên thành viên",
      dataIndex: "userName",
      sorter: (a, b) => a.userName.localeCompare(b.userName),
    },
    {
      title: "Cấp độ",
      dataIndex: "activityPoint",
      render: (activityPoint) => {
        return <Level point={activityPoint}></Level>;
      },
      sorter: (a, b) => a.activityPoint - b.activityPoint,
    },
    {
      title: "Vai trò",
      dataIndex: "userName",
      sorter: (a, b) => a.userName.localeCompare(b.userName),
      render: (userName) => {
        return (
          <Badge
            variant="outline"
            colorScheme={userName == groupHost ? "yellow" : "green"}
          >
            {userName == groupHost ? "Chủ nhóm" : "Thành viên"}
          </Badge>
        );
      },
    },
    {
      title: "Hồ sơ",
      dataIndex: "userName",
      render: (userName) => {
        return (
          <Link className="font-bold" href={`/profile/${userName}`}>
            Ghé thăm
          </Link>
        );
      },
    },
  ];

  const fetchMember = async () => {
    try {
      const res = await getGroupMember(groupID);
      const data: DataType[] = res.data.map((item: { userId: any }) => ({
        ...item,
        key: item.userId,
      }));
      setMemeber(data);
    } catch (error) {
      console.log(error);
    }
  };

  const onSelectChange = (
    newSelectedRowKeys: React.Key[],
    selectedRows: DataType[],
  ) => {
    if (user.userName === groupHost) {
      const filteredSelectedRows = selectedRows.filter(
        (row) => row.userName !== groupHost,
      );
      const newSelectedUserNames = filteredSelectedRows.map(
        (row) => row.userName,
      );

      setSelectedRowKeys(newSelectedRowKeys);
      setSelectedUserNames(newSelectedUserNames);
    }
  };

  const handleKickMembers = async () => {
    try {
      selectedUserNames.map(async (value) => {
        await kickMember(groupID, value);
      });

      const updatedMembers = memeber.filter(
        (member) => !selectedUserNames.includes(member.userName),
      );
      setMemeber(updatedMembers);
    } catch (error) {
      console.log(error);
    }
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;

  const canKick = user.userName === groupHost;

  useEffect(() => {
    fetchMember();
  }, []);

  return (
    <div className="w-full">
      <div style={{ marginBottom: 16 }}>
        {canKick && (
          <Button
            style={{
              background: hasSelected ? "red" : "",
              color: "white",
            }}
            type="primary"
            onClick={handleKickMembers}
            disabled={!hasSelected}
            loading={loading}
          >
            Kick
          </Button>
        )}

        <Button
          style={{ marginLeft: 8, color: "black" }}
          type="primary"
          onClick={() => {
            const sortedMembers = [...memeber].sort((a, b) =>
              a.userName.localeCompare(b.userName),
            );
            setMemeber(sortedMembers);
          }}
        >
          Sắp xếp theo tên
        </Button>

        <Button
          style={{ marginLeft: 8, color: "black" }}
          type="primary"
          onClick={() => {
            const sortedMembers = [...memeber].sort(
              (a, b) => a.activityPoint - b.activityPoint,
            );
            setMemeber(sortedMembers);
          }}
        >
          Sắp xếp theo điểm
        </Button>

        <span style={{ marginLeft: 8 }}>
          {hasSelected ? `Chọn ${selectedRowKeys.length} thành viên` : ""}
        </span>
      </div>
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={memeber}
      />
    </div>
  );
};

export default CommunityMember;
