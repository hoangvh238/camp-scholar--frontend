import {
  Box,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import {
  Card,
  IconButton,
  List,
  ListItem,
  ListItemSuffix,
} from "../../common/common";
import { Divider } from "antd";

import { RootState } from "@/redux/store";
import { message } from "antd";
import React, { useEffect, useState } from "react";
import { MdReportGmailerrorred } from "react-icons/md";
import { useSelector } from "react-redux";
import { getAllReportType, reportPost } from "../../../../apis/posts";

type Report = {
  name: string;
  id: number;
};

type ReportModalProps = {
  open: boolean;
  handleClose: () => void;
  postId: number;
  setIsReport: (state: boolean) => void;
};

const ReportModal: React.FC<ReportModalProps> = ({
  open,
  handleClose,
  postId,
  setIsReport,
}) => {
  const [reportOptions, setReportOptions] = useState<Report[]>([]);
  const [value, setValue] = useState("");
  const [type, setType] = useState(-1);

  const userId = useSelector(
    (state: RootState) => state.userInfor.currentUser?.userId,
  );

  function TrashIcon() {
    return (
      <MdReportGmailerrorred className="w-[30px] h-[30px]"></MdReportGmailerrorred>
    );
  }

  const getAllReportChoice = async () => {
    try {
      const res = await getAllReportType();
      const data: Report[] = res.data;
      setReportOptions(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleReport = async () => {
    if (type == -1) {
      message.error("Hãy chọn loại báo cáo !");
      return;
    }
    try {
      await reportPost(postId, userId, type, value);
      setIsReport(true);
      message.success("Cảm ơn bạn đã báo cáo !");
    } catch (error) {
      message.error("Báo cáo thất bại");
      console.log(error);
    }
  };
  const handleChange = (event: any) => setValue(event.target.value);

  useEffect(() => {
    getAllReportChoice();
  }, []);

  useEffect(() => {
    console.log(type);
  }, [type]);
  return (
    <>
      <Modal isOpen={open} onClose={handleClose} size="lg">
        <ModalOverlay />
        <ModalContent top={"100px"}>
          <ModalHeader
            display="flex"
            flexDirection="column"
            fontSize={15}
            padding={3}
          ></ModalHeader>

          <Box pl={3} pr={3}>
            <ModalCloseButton />
            <Text className="text-center font-bold">Báo cáo</Text>
            <ModalBody display="flex" flexDirection="column" padding="10px 0px">
              <Divider className="mt-0 pt-0 pt-0 pb-0"></Divider>
              <Card
                className="w-100"
                nonce={undefined}
                onResize={undefined}
                onResizeCapture={undefined}
              >
                <List
                  nonce={undefined}
                  onResize={undefined}
                  onResizeCapture={undefined}
                >
                  {reportOptions &&
                    reportOptions.map((value: Report, index: number) => (
                      <>
                        <ListItem
                          nonce={undefined}
                          onResize={undefined}
                          onResizeCapture={undefined}
                          ripple={false}
                          className={`py-1 pr-1 pl-4  ${
                            index + 1 === type ? "bg-gray-200" : ""
                          }`}
                          onClick={() => {
                            setType(index + 1);
                          }}
                        >
                          {index + 1}. {value.name}
                          <ListItemSuffix
                            nonce={undefined}
                            onResize={undefined}
                            onResizeCapture={undefined}
                          >
                            <IconButton
                              nonce={undefined}
                              onResize={undefined}
                              onResizeCapture={undefined}
                              variant="text"
                              color="blue-gray"
                            >
                              <TrashIcon />
                            </IconButton>
                          </ListItemSuffix>
                        </ListItem>
                      </>
                    ))}
                </List>

                <Text className="text-center text-[20px] font-bold" mb="10px">
                  Mô tả báo cáo
                </Text>
                <Input
                  value={value}
                  onChange={handleChange}
                  placeholder="Nhập mô tả ở đây"
                  size="md"
                />
              </Card>
              <Button onClick={handleReport} className="mt-8">
                Gửi
              </Button>
            </ModalBody>
          </Box>
        </ModalContent>
      </Modal>
    </>
  );
};
export default ReportModal;
