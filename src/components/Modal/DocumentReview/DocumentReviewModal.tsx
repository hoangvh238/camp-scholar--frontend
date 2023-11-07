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
import { useRouter } from "next/router";
import React, { useState } from "react";
import { BsCoin, BsDot } from "react-icons/bs";
import { SiCodereview } from "react-icons/si";

import { Document } from "@/atoms/DocumentAtom";
import DocumentReview from "@/components/DocumentCard/DocumentReview";
import Level from "@/components/common/Level";
import Rate from "@/components/common/Rating";
import { RootState } from "@/redux/store";
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
import { TiShoppingCart } from "react-icons/ti";
import { useSelector } from "react-redux";
import { buyDoc } from "../../../../apis/documents";
import { formatTimeToNow } from "../../../../ultils/utils";
type DocumentReviewModal = {
  open: boolean;
  handleClose: () => void;
  document: Document;
  rating: number;
  isAuth: boolean;
  setIsAuth: (value: boolean) => void;
  onBough: (value: number) => Promise<void>;
  isBuying: boolean;
  urlImg: any;
};

const DocumentReviewModal: React.FC<DocumentReviewModal> = ({
  open,
  handleClose,
  document,
  rating,
  isAuth,
  setIsAuth,
  isBuying,
  urlImg,
}) => {
  const coint = useSelector((state: RootState) => state.userInfor.userCoint);
  const router = useRouter();
  const bg = useColorModeValue("gray.100", "#1A202C");
  const textColor = useColorModeValue("gray.500", "gray.400");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef: any = React.useRef();
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const handleBough = async (docId: number) => {
    onClose();
    try {
      await buyDoc(docId);
      message.success("Mua thành công");
      router.push("/group/document");
    } catch (error) {
      if (coint.coint < document.cost) message.error("Không đủ Xu");
      else message.error("Mua thất bại");
      console.log(error);
    }
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
          <AlertDialogHeader>Mua?</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            Bạn có chắc mua tài liệu với giá : {document.cost} Xu
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button
              ref={cancelRef}
              onClick={() => handleBough(document.documentId)}
            >
              Mua
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
                  <DocumentReview
                    docId={document.documentId}
                    isBuying={isBuying}
                  ></DocumentReview>
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
                            {document.cost == 0
                              ? "Miễn phí"
                              : document.cost + " Xu"}{" "}
                            <BsCoin className="mt-1"></BsCoin>
                          </Typography>
                        </Flex>
                        <Flex gap={2} flexDirection={"row"}>
                          {" "}
                          <Rate
                            docId={document.documentId}
                            setIsAuth={setIsAuth}
                            rate={rating}
                            isAuth={isAuth}
                            isDisable={!isBuying ? true : isAuth ? true : false}
                            style={"row"}
                          ></Rate>
                          <Typography
                            variant="lead"
                            color="blue-gray"
                            nonce={undefined}
                            onResize={undefined}
                            onResizeCapture={undefined}
                          >
                            ({document.ratings.length})
                          </Typography>
                          <Typography
                            className="text-[12px] align-middle"
                            variant="lead"
                            color="blue-gray"
                            nonce={undefined}
                            onResize={undefined}
                            onResizeCapture={undefined}
                          >
                            {isAuth
                              ? "Đã đánh giá"
                              : isBuying
                              ? "Đánh giá ngay"
                              : ""}
                          </Typography>
                        </Flex>

                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="mb-2"
                          nonce={undefined}
                          onResize={undefined}
                          onResizeCapture={undefined}
                        >
                          {document.bills} Lượt mua
                        </Typography>
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
                            {isBuying ? "Xem ngay" : "Xem trước"}
                          </Typography>
                        </Flex>
                        {isBuying ? (
                          <></>
                        ) : (
                          <Flex flexDirection={"column"}>
                            <IconButton
                              className="mt-8"
                              colorScheme="teal"
                              variant="outline"
                              aria-label="Call Segun"
                              size="lg"
                              icon={<TiShoppingCart />}
                              onClick={onOpen}
                            />

                            <Typography
                              variant="h5"
                              color="blue-gray"
                              nonce={undefined}
                              onResize={undefined}
                              onResizeCapture={undefined}
                              onClick={onOpen}
                            >
                              Mua ngay
                            </Typography>
                          </Flex>
                        )}
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
export default DocumentReviewModal;
