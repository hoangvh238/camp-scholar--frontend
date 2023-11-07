import {
  Button,
  Flex,
  Icon,
  IconButton,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { Input } from "@material-tailwind/react";
import React, { useState } from "react";
import { BsCoin, BsDot } from "react-icons/bs";
import { SiCodereview } from "react-icons/si";

import { Document } from "@/atoms/DocumentAtom";
import DocumentReviewBrowse from "@/components/DocumentCard/DocumentReviewBrowse";
import Level from "@/components/common/Level";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import {
  Card,
  CardBody,
  CardHeader,
  Carousel,
  Typography,
} from "@material-tailwind/react";
import { message } from "antd";
import { AiOutlineCheck } from "react-icons/ai";
import { FaBan } from "react-icons/fa";
import { acceptDocument, rejectDocument } from "../../../../apis/documents";
import { formatTimeToNow } from "../../../../ultils/utils";
type DocumentReviewModal = {
  open: boolean;
  handleClose: () => void;
  document: Document;
  urlImg: any;
  onResetList: any;
};

const DocumentReviewModalBrowse: React.FC<DocumentReviewModal> = ({
  open,
  handleClose,
  document,
  urlImg,
  onResetList,
}) => {
  const bg = useColorModeValue("gray.100", "#1A202C");
  const textColor = useColorModeValue("gray.500", "gray.400");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef: any = React.useRef();
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [input, setInput] = useState("");

  const handleInputChange = (event: any) => {
    setInput(event.target.value);
  };
  const handleAccept = async (docId: number) => {
    try {
      await acceptDocument(docId);
      message.success("Duyệt post thành công");
      onResetList();
    } catch (error) {
      message.error("Duyệt post thất bại");
    }
    onClose();
  };

  const handleReject = async (docId: number) => {
    onClose();
    try {
      await rejectDocument(docId, input);
      message.success("Từ chối tài liệu thành công");
      onResetList();
    } catch (error) {
      message.error("Từ chối tài liệu thất bại");
    }
    onClose();
  };

  return (
    <>
      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>Nguyên nhân ?</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            <Input
              variant="outlined"
              value={input} // Kết nối giá trị của Input với trạng thái 'input'
              onChange={handleInputChange} // Xử lý sự kiện thay đổi giá trị
              label="Nhập nguyên nhân..."
              nonce={undefined}
              onResize={undefined}
              onResizeCapture={undefined}
            />
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button
              ref={cancelRef}
              onClick={() => handleReject(document.documentId)}
            >
              Gửi
            </Button>
            <Button colorScheme="red" ml={3} onClick={onClose}>
              Hủy
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Modal isOpen={open} onClose={handleClose} size="6xl">
        <ModalOverlay />
        <ModalContent>
          <ModalBody
            display="flex"
            flexDirection="column"
            padding={0}
            rounded={0}
          >
            <Card
              className="w-full h-[640px] flex-row justify-center"
              nonce={undefined}
              onResize={undefined}
              onResizeCapture={undefined}
            >
              {!isPreviewMode ? <ModalCloseButton /> : ""}
              {isPreviewMode ? (
                <>
                  <DocumentReviewBrowse
                    docId={document.documentId}
                  ></DocumentReviewBrowse>
                  <div className="w-0 relative">
                    <Button
                      className="absolute top-[10%] right-[50%]"
                      onClick={() => setIsPreviewMode(false)}
                    >
                      X
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <CardHeader
                    shadow={false}
                    floated={false}
                    className="m-0 w-2/5 shrink-0 rounded-r-none"
                    nonce={undefined}
                    onResize={undefined}
                    onResizeCapture={undefined}
                  >
                    <Carousel
                      className="rounded-sm"
                      navigation={({ setActiveIndex, activeIndex, length }) => (
                        <div className="absolute bottom-4 left-2/4 z-50 flex -translate-x-2/4 gap-2">
                          {new Array(length).fill("").map((_, i) => (
                            <span
                              key={i}
                              className={`block h-1 cursor-pointer rounded-2xl transition-all content-[''] ${
                                activeIndex === i
                                  ? "w-8 bg-white"
                                  : "w-4 bg-white/50"
                              }`}
                              onClick={() => setActiveIndex(i)}
                            />
                          ))}
                        </div>
                      )}
                      nonce={undefined}
                      onResize={undefined}
                      onResizeCapture={undefined}
                    >
                      <img
                        src={urlImg}
                        alt="image 1"
                        className="h-full w-full object-cover"
                      />
                      <img
                        src={urlImg}
                        alt="image 2"
                        className="h-full w-full object-cover"
                      />
                      <img
                        src={urlImg}
                        alt="image 3"
                        className="h-full w-full object-cover"
                      />
                    </Carousel>
                  </CardHeader>
                  <CardBody
                    nonce={undefined}
                    className="w-full"
                    onResize={undefined}
                    onResizeCapture={undefined}
                  >
                    <Flex alignContent={"center"} height={"4%"} gap={2}>
                      <Flex gap={1}>
                        {" "}
                        <div>
                          <Level point={100}></Level>
                        </div>
                        <Text>
                          <Link
                            className="font-bold"
                            href={`/profile/${document.author}`}
                          >
                            {document.author}
                          </Link>{" "}
                        </Text>
                      </Flex>
                      <Icon as={BsDot} color="gray.500" fontSize={30} />
                      <Text> {formatTimeToNow(new Date(document.time))} </Text>
                    </Flex>
                    <Flex height={"70%"} marginTop={5} flexDirection={"column"}>
                      <Typography
                        variant="h4"
                        color="blue-gray"
                        className="mb-2"
                        nonce={undefined}
                        onResize={undefined}
                        onResizeCapture={undefined}
                      >
                        {document.documentName}
                      </Typography>
                      <Typography
                        color="gray"
                        className="mb-8 font-normal overflow-y-scroll "
                        nonce={undefined}
                        onResize={undefined}
                        onResizeCapture={undefined}
                      >
                        {document.description}
                      </Typography>
                    </Flex>
                    <Flex
                      height={"26%"}
                      width={"100%"}
                      justifyContent={"space-between"}
                    >
                      <Flex flexDirection={"column"} gap={6}>
                        <Flex flexDirection={"row"}>
                          <Typography
                            className="flex gap-2"
                            variant="h5"
                            color="blue-gray"
                            nonce={undefined}
                            onResize={undefined}
                            onResizeCapture={undefined}
                          >
                            Giá bán :{" "}
                            {document.cost == 0
                              ? "Miễn phí"
                              : document.cost + " Xu"}{" "}
                            <BsCoin className="mt-1"></BsCoin>
                          </Typography>
                        </Flex>
                      </Flex>

                      <Flex marginRight={8} gap={8}>
                        <Flex flexDirection={"column"}>
                          <IconButton
                            colorScheme="orange"
                            className="mt-8"
                            variant="outline"
                            aria-label="Call Segun"
                            size="lg"
                            icon={<SiCodereview />}
                            onClick={() => setIsPreviewMode(true)}
                          />
                          <Typography
                            onClick={() => setIsPreviewMode(true)}
                            variant="h5"
                            color="blue-gray"
                            nonce={undefined}
                            onResize={undefined}
                            onResizeCapture={undefined}
                          >
                            {"Kiểm tra"}
                          </Typography>
                        </Flex>
                        <Flex flexDirection={"column"}>
                          <IconButton
                            className="mt-8"
                            colorScheme="teal"
                            variant="outline"
                            aria-label="Call Segun"
                            size="lg"
                            icon={<AiOutlineCheck />}
                            onClick={() => {
                              handleAccept(document.documentId);
                            }}
                          />

                          <Typography
                            variant="h5"
                            color="light-green"
                            nonce={undefined}
                            onResize={undefined}
                            onResizeCapture={undefined}
                            onClick={() => {
                              handleAccept(document.documentId);
                            }}
                          >
                            Chấp nhận
                          </Typography>
                        </Flex>
                        <Flex flexDirection={"column"}>
                          <IconButton
                            className="mt-8"
                            colorScheme="teal"
                            variant="outline"
                            aria-label="Call Segun"
                            size="lg"
                            icon={<FaBan />}
                            onClick={onOpen}
                          />

                          <Typography
                            variant="h5"
                            color="red"
                            nonce={undefined}
                            onResize={undefined}
                            onResizeCapture={undefined}
                            onClick={onOpen}
                          >
                            Từ chối
                          </Typography>
                        </Flex>
                      </Flex>
                    </Flex>
                  </CardBody>
                </>
              )}
            </Card>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
export default DocumentReviewModalBrowse;
